import type { Gin, RegionMarker } from '../types';

interface Props {
  marker: RegionMarker;
  onSelectGin: (gin: Gin) => void;
}

export function RegionList({ marker, onSelectGin }: Props) {
  return (
    <div>
      <div className="panel-eyebrow">Regione</div>
      <div className="display panel-region-title">{marker.region}</div>
      <div className="panel-region-sub">
        {marker.country} &mdash; {marker.gins.length} gin in questa regione
      </div>

      <div className="region-list">
        {marker.gins.map((gin) => (
          <button
            key={gin.id}
            type="button"
            className="region-list__item"
            onClick={() => onSelectGin(gin)}
          >
            <span className="display region-list__name">{gin.name}</span>
            <span className="region-list__type">{gin.type}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
