
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Save, MapPin, Droplets, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

interface FuelStation {
  id: string;
  name: string;
  location: string;
  distance: string;
  petrolPrice: number;
  dieselPrice: number;
}

const initialStations: FuelStation[] = [
  {
    id: 'station1',
    name: 'Bharat Petroleum',
    location: 'MVP colony, Visakhapatnam',
    distance: '1.2 km',
    petrolPrice: 102.50,
    dieselPrice: 96.25,
  },
  {
    id: 'station2',
    name: 'Indian Oil',
    location: 'Endada,Visakhapatnam',
    distance: '2.5 km',
    petrolPrice: 102.65,
    dieselPrice: 96.40,
  },
  {
    id: 'station3',
    name: 'Hindustan Petroleum',
    location: 'Madhurawada,Visakhapatnam',
    distance: '3.8 km',
    petrolPrice: 102.45,
    dieselPrice: 96.15,
  },
  {
    id: 'station4',
    name: 'Reliance Petroleum',
    location: 'Maddillapalem,Visakhapatnam',
    distance: '4.3 km',
    petrolPrice: 102.70,
    dieselPrice: 96.35,
  },
  {
    id: 'station5',
    name: 'Bharat Petroleum',
    location: 'RTC Complex,Visakhapatnam',
    distance: '5.1 km',
    petrolPrice: 102.55,
    dieselPrice: 96.20,
  },
];

const NearbyStations: React.FC = () => {
  const [stations, setStations] = useState<FuelStation[]>(initialStations);
  const [editingStation, setEditingStation] = useState<string | null>(null);
  const [tempPrices, setTempPrices] = useState<{[key: string]: {petrol: number, diesel: number}}>({});

  const handleEditStart = (station: FuelStation) => {
    setEditingStation(station.id);
    setTempPrices({
      ...tempPrices,
      [station.id]: {
        petrol: station.petrolPrice,
        diesel: station.dieselPrice
      }
    });
  };

  const handlePriceChange = (stationId: string, fuelType: 'petrol' | 'diesel', value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    setTempPrices({
      ...tempPrices,
      [stationId]: {
        ...tempPrices[stationId],
        [fuelType]: numValue
      }
    });
  };

  const handleSave = (stationId: string) => {
    setStations(stations.map(station => {
      if (station.id === stationId && tempPrices[stationId]) {
        return {
          ...station,
          petrolPrice: tempPrices[stationId].petrol,
          dieselPrice: tempPrices[stationId].diesel
        };
      }
      return station;
    }));

    // Update global fuel prices if this is being used for ordering
    if (stationId === 'station1') {
      // This would update the global fuel prices in a real app
      // For now we just show a toast notification
      toast.success('Fuel prices updated successfully');
    }

    setEditingStation(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nearby Fuel Stations</CardTitle>
        <CardDescription>
          Current fuel prices at stations near your location
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Station Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>
                Petrol <span className="text-muted-foreground font-normal">(₹/L)</span>
              </TableHead>
              <TableHead>
                Diesel <span className="text-muted-foreground font-normal">(₹/L)</span>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stations.map((station) => (
              <TableRow key={station.id}>
                <TableCell className="font-medium">{station.name}</TableCell>
                <TableCell className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  {station.location}
                </TableCell>
                <TableCell>{station.distance}</TableCell>

                <TableCell>
                  {editingStation === station.id ? (
                    <div className="flex items-center">
                      <IndianRupee className="h-3.5 w-3.5 mr-0.5 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={tempPrices[station.id]?.petrol || station.petrolPrice}
                        onChange={(e) => handlePriceChange(station.id, 'petrol', e.target.value)}
                        className="h-8 w-20"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                      {station.petrolPrice.toFixed(2)}
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  {editingStation === station.id ? (
                    <div className="flex items-center">
                      <IndianRupee className="h-3.5 w-3.5 mr-0.5 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={tempPrices[station.id]?.diesel || station.dieselPrice}
                        onChange={(e) => handlePriceChange(station.id, 'diesel', e.target.value)}
                        className="h-8 w-20"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                      {station.dieselPrice.toFixed(2)}
                    </div>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  {editingStation === station.id ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSave(station.id)}
                      className="h-8"
                    >
                      <Save className="h-3.5 w-3.5 mr-1.5" />
                      Save
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditStart(station)}
                      className="h-8"
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1.5" />
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default NearbyStations;
