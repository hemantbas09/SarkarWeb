import './RegionFilter.scss'

function RegionFilter({
  config,
  provinces,
  districts,
  activeProvince,
  activeDistrict,
  onSelectProvince,
  onSelectDistrict,
}: {
  config: { allProvinces: string; allDistricts: string }
  provinces: string[]
  districts: string[]
  activeProvince: string
  activeDistrict: string
  onSelectProvince: (province: string) => void
  onSelectDistrict: (district: string) => void
}) {
  return (
    <div className="region-filter">
      <label className="region-filter__field">
        <span className="region-filter__label">Province</span>
        <select
          className="region-filter__select"
          value={activeProvince}
          onChange={(e) => onSelectProvince(e.target.value)}
          aria-label="Filter by pradesh"
        >
          <option value="all">{config.allProvinces}</option>
          {provinces.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </label>
      <label className="region-filter__field">
        <span className="region-filter__label">District</span>
        <select
          className="region-filter__select"
          value={activeDistrict}
          onChange={(e) => onSelectDistrict(e.target.value)}
          aria-label="Filter by district"
        >
          <option value="all">{config.allDistricts}</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

export default RegionFilter
