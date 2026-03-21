"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock, Check, Loader2 } from "lucide-react";
import { bookTurfSlot } from "@/app/dashboard/turfs/actions";
import type { TurfSlot } from "@/lib/types";

interface TurfBookingCalendarProps {
  turfId: string;
  slots: TurfSlot[];
  userId?: string;
  pricePerHour: number;
}

export function TurfBookingCalendar({ 
  turfId, 
  slots, 
  userId, 
  pricePerHour 
}: TurfBookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TurfSlot | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, TurfSlot[]>);

  const dates = Object.keys(slotsByDate).sort();

  // Auto-select first date on initial mount or when slots change
  useEffect(() => {
    if (!selectedDate && dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  }, [dates.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBook = async () => {
    if (!selectedSlot || !userId) return;

    setIsBooking(true);
    setMessage(null);

    const result = await bookTurfSlot(selectedSlot.id, userId);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Slot booked successfully!" });
      setSelectedSlot(null);
    }

    setIsBooking(false);
  };

  if (dates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No available slots for the next 7 days</p>
        <p className="text-sm text-muted-foreground mt-2">
          Contact the turf directly to inquire about availability
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Select Date</h4>
        <div className="flex flex-wrap gap-2">
          {dates.map((date) => {
            const d = new Date(date);
            const isToday = d.toDateString() === new Date().toDateString();
            const dayName = isToday ? "Today" : d.toLocaleDateString("en-KE", { weekday: "short" });
            const dayNum = d.getDate();
            const month = d.toLocaleDateString("en-KE", { month: "short" });

            return (
              <Button
                key={date}
                variant={selectedDate === date ? "default" : "outline"}
                className={cn(
                  "flex flex-col h-auto py-2 px-4",
                  selectedDate === date && "bg-primary text-primary-foreground"
                )}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                }}
              >
                <span className="text-xs">{dayName}</span>
                <span className="text-lg font-bold">{dayNum}</span>
                <span className="text-xs">{month}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Available Times</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {slotsByDate[selectedDate]?.map((slot) => {
              const isSelected = selectedSlot?.id === slot.id;
              const isBooked = slot.is_booked;

              return (
                <Button
                  key={slot.id}
                  variant={isSelected ? "default" : "outline"}
                  disabled={isBooked}
                  className={cn(
                    "flex items-center gap-2 justify-center",
                    isSelected && "bg-primary text-primary-foreground",
                    isBooked && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => setSelectedSlot(slot)}
                >
                  <Clock className="w-4 h-4" />
                  {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                  {isBooked && <Badge variant="secondary" className="ml-2 text-xs">Booked</Badge>}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Booking Summary */}
      {selectedSlot && (
        <Card className="bg-secondary/50 border-border">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h4 className="font-medium text-foreground">Booking Summary</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(selectedSlot.date).toLocaleDateString("en-KE", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })} at {selectedSlot.start_time.slice(0, 5)} - {selectedSlot.end_time.slice(0, 5)}
                </p>
                <p className="text-lg font-bold text-primary mt-2">
                  KES {pricePerHour}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {!userId ? (
                  <Button disabled>
                    Sign in to Book
                  </Button>
                ) : (
                  <Button onClick={handleBook} disabled={isBooking}>
                    {isBooking ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 w-4 h-4" />
                        Confirm Booking
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            {message && (
              <p className={cn(
                "mt-4 text-sm",
                message.type === "success" ? "text-green-500" : "text-destructive"
              )}>
                {message.text}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
