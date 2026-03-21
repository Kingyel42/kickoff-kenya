"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function bookTurfSlot(slotId: string, userId: string) {
  const supabase = await createClient();

  // Check if slot is still available
  const { data: slot, error: slotError } = await supabase
    .from("turf_slots")
    .select("*")
    .eq("id", slotId)
    .single();

  if (slotError || !slot) {
    return { error: "Slot not found" };
  }

  if (slot.is_booked) {
    return { error: "This slot has already been booked" };
  }

  // Book the slot
  const { error: bookError } = await supabase
    .from("turf_slots")
    .update({
      is_booked: true,
      booked_by: userId,
    })
    .eq("id", slotId);

  if (bookError) {
    return { error: "Failed to book slot. Please try again." };
  }

  // Revalidate the page
  revalidatePath(`/dashboard/turfs/${slot.turf_id}`);

  return { success: true };
}

export async function cancelTurfBooking(slotId: string, userId: string) {
  const supabase = await createClient();

  // Verify user owns the booking
  const { data: slot } = await supabase
    .from("turf_slots")
    .select("*")
    .eq("id", slotId)
    .eq("booked_by", userId)
    .single();

  if (!slot) {
    return { error: "Booking not found or you don't have permission to cancel" };
  }

  // Cancel the booking
  const { error } = await supabase
    .from("turf_slots")
    .update({
      is_booked: false,
      booked_by: null,
    })
    .eq("id", slotId);

  if (error) {
    return { error: "Failed to cancel booking. Please try again." };
  }

  revalidatePath(`/dashboard/turfs/${slot.turf_id}`);

  return { success: true };
}
