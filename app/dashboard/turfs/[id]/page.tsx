import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  MapPin, 
  Star, 
  Users, 
  Phone,
  Mail,
  Clock,
  ArrowLeft,
  Calendar,
  Check
} from "lucide-react";
import { TurfBookingCalendar } from "@/components/turfs/turf-booking-calendar";
import type { Turf, TurfSlot } from "@/lib/types";

export default async function TurfDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: turf } = await supabase
    .from("turfs")
    .select("*")
    .eq("id", id)
    .single();

  if (!turf) {
    notFound();
  }

  // Get available slots for the next 7 days
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const { data: slots } = await supabase
    .from("turf_slots")
    .select("*")
    .eq("turf_id", id)
    .gte("date", today.toISOString().split("T")[0])
    .lte("date", nextWeek.toISOString().split("T")[0])
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  return (
    <div className="pt-14 space-y-6">
      {/* Back button */}
      <Link 
        href="/dashboard/turfs" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Turfs
      </Link>

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Image */}
        <div className="h-64 md:h-80 rounded-xl bg-secondary overflow-hidden">
          {turf.image_url ? (
            <img 
              src={turf.image_url} 
              alt={turf.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-primary" />
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{turf.name}</h1>
              {turf.rating > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-foreground">{turf.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{turf.location}</span>
            </div>
            {turf.address && (
              <p className="text-sm text-muted-foreground mt-1">{turf.address}</p>
            )}
          </div>

          {turf.description && (
            <p className="text-muted-foreground">{turf.description}</p>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{turf.capacity}</p>
                  <p className="text-xs text-muted-foreground">Max Players</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-primary">KES {turf.price_per_hour}</p>
                  <p className="text-xs text-muted-foreground">Per Hour</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Amenities */}
          {turf.amenities && turf.amenities.length > 0 && (
            <div>
              <h3 className="font-medium text-foreground mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {turf.amenities.map((amenity: string) => (
                  <Badge key={amenity} variant="outline" className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-primary" />
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="flex flex-wrap gap-4">
            {turf.contact_phone && (
              <a 
                href={`tel:${turf.contact_phone}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                {turf.contact_phone}
              </a>
            )}
            {turf.contact_email && (
              <a 
                href={`mailto:${turf.contact_email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                {turf.contact_email}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Book a Slot
          </CardTitle>
          <CardDescription>
            Select an available time slot to book this turf
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TurfBookingCalendar 
            turfId={turf.id} 
            slots={slots || []} 
            userId={user?.id}
            pricePerHour={turf.price_per_hour}
          />
        </CardContent>
      </Card>
    </div>
  );
}
