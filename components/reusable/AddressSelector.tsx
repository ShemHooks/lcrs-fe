"use client";

import { useEffect, useState } from "react";
import { regions, provinces, cities, barangays } from "phil-address";

import SearchableSelect, { type SelectItem } from "./SearchableSelect";

export interface AddressValue {
  regionCode?: string;
  regionName?: string;

  provinceCode?: string;
  provinceName?: string;

  cityCode?: string;
  cityName?: string;

  barangayCode?: string;
  barangayName?: string;
}

interface AddressSelectorProps {
  value: AddressValue;
  onChange: (value: AddressValue) => void;
  fields?: ("region" | "province" | "city" | "barangay")[];
}

const normalize = (data: any[]): SelectItem[] =>
  data.map((item) => ({
    id: item.id ?? item.psgcCode ?? item.code,
    name: item.name,
  }));

export default function AddressSelector({
  value,
  onChange,
  fields = ["region", "province", "city", "barangay"],
}: AddressSelectorProps) {
  const [regionList, setRegionList] = useState<SelectItem[]>([]);
  const [provinceList, setProvinceList] = useState<SelectItem[]>([]);
  const [cityList, setCityList] = useState<SelectItem[]>([]);
  const [barangayList, setBarangayList] = useState<SelectItem[]>([]);

  const showRegion = fields.includes("region");
  const showProvince = fields.includes("province");
  const showCity = fields.includes("city");
  const showBarangay = fields.includes("barangay");

  useEffect(() => {
    const init = async () => {
      const regionData = await regions();
      setRegionList(normalize(regionData));
    };

    init();
  }, []);

  // REGION
  const handleRegionChange = async (regionId: string) => {
    const selected = regionList.find((r) => r.id === regionId);

    const provinceData = await provinces(regionId);

    setProvinceList(normalize(provinceData));
    setCityList([]);
    setBarangayList([]);

    onChange({
      regionCode: regionId,
      regionName: selected?.name ?? "",

      provinceCode: "",
      provinceName: "",

      cityCode: "",
      cityName: "",

      barangayCode: "",
      barangayName: "",
    });
  };

  // PROVINCE
  const handleProvinceChange = async (provinceId: string) => {
    const selected = provinceList.find((p) => p.id === provinceId);

    const cityData = await cities(provinceId);

    setCityList(normalize(cityData));
    setBarangayList([]);

    onChange({
      ...value,

      provinceCode: provinceId,
      provinceName: selected?.name ?? "",

      cityCode: "",
      cityName: "",

      barangayCode: "",
      barangayName: "",
    });
  };

  // CITY
  const handleCityChange = async (cityId: string) => {
    const selected = cityList.find((c) => c.id === cityId);

    const barangayData = await barangays(cityId);

    setBarangayList(normalize(barangayData));

    onChange({
      ...value,

      cityCode: cityId,
      cityName: selected?.name ?? "",

      barangayCode: "",
      barangayName: "",
    });
  };

  // BARANGAY
  const handleBarangayChange = (barangayId: string) => {
    const selected = barangayList.find((b) => b.id === barangayId);

    onChange({
      ...value,

      barangayCode: barangayId,
      barangayName: selected?.name ?? "",
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {showRegion && (
        <SearchableSelect
          items={regionList}
          value={value.regionCode}
          placeholder="Select Region"
          onChange={handleRegionChange}
        />
      )}

      {showProvince && (
        <SearchableSelect
          items={provinceList}
          value={value.provinceCode}
          placeholder="Select Province"
          disabled={showRegion && !value.regionCode}
          onChange={handleProvinceChange}
        />
      )}

      {showCity && (
        <SearchableSelect
          items={cityList}
          value={value.cityCode}
          placeholder="Select City / Municipality"
          disabled={!value.provinceCode}
          onChange={handleCityChange}
        />
      )}

      {showBarangay && (
        <SearchableSelect
          items={barangayList}
          value={value.barangayCode}
          placeholder="Select Barangay"
          disabled={!value.cityCode}
          onChange={handleBarangayChange}
        />
      )}
    </div>
  );
}
