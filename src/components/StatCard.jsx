import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({
  title,
  value,
  icon: Icon,
  colorTheme = 'green',
  trend
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {Icon && (
          <div className={`stat-icon-wrapper ${colorTheme}`}>
            <Icon size={22} />
          </div>
        )}
      </div>

      <div className="stat-card-value">{value}</div>

      {trend && (
        <div className="stat-card-footer">
          <span className={`stat-trend ${trend.isUp ? 'up' : 'down'}`}>
            {trend.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trend.value}
          </span>
          {trend.label && <span className="stat-trend-label">{trend.label}</span>}
        </div>
      )}
    </div>
  );
}

