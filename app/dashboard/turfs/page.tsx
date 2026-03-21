import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { 
  MapPin, 
  Star, 
  Users, 
  Phone,
  Search,
  Filter,
  Banknote
} from "lucide-react";
import type { Turf } from "@/lib/types";

export default async function TurfsPage() {
  const supabase = await createClient();

  const { data: turfs } = await supabase
    .from("turfs")
    .select("*")
    .eq("is_active", true)
    .order("rating", { ascending: false });

  return (
    <div className="pt-14 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Turfs</h1>
          <p className="text-muted-foreground">Find and book football grounds near you</p>
        </div>
      </div>

      {/* Search/Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search turfs by name or location..." 
            className="pl-10 bg-input"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Turfs Grid */}
      {turfs && turfs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turfs.map((turf: Turf) => (
            <TurfCard key={turf.id} turf={turf} />
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No turfs available at the moment</p>
            <p className="text-sm text-muted-foreground mt-2">Check back later for new listings</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TurfCard({ turf }: { turf: Turf }) {
  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors overflow-hidden">
      {/* Image */}
      <div className="h-40 bg-secondary relative">
        {turf.image_url ? (
          <img 
            src={turf.image_url} 
            alt={turf.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
          </div>
        )}
        {turf.rating > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-foreground">{turf.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground">{turf.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{turf.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{turf.capacity} players</span>
            </div>
            {turf.total_reviews > 0 && (
              <span>{turf.total_reviews} reviews</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-primary font-semibold">
            <Banknote className="w-4 h-4" />
            <span>KES {turf.price_per_hour}/hr</span>
          </div>
        </div>

        {/* Amenities */}
        {turf.amenities && turf.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {turf.amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {turf.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{turf.amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <Button className="w-full" asChild>
          <Link href={`/dashboard/turfs/${turf.id}`}>View & Book</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
