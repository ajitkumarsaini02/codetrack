import {
  ExternalLink,
  Trash2,
  Trophy,
  Flame,
  Star,
  CheckCircle2,
  AlertCircle,
  GitFork,
  RefreshCw,
} from "lucide-react";

const PlatformCard = ({
  platformId,
  platform,
  name,
  username,
  solved = 0,
  easySolved = 0,
  mediumSolved = 0,
  hardSolved = 0,
  rating,
  maxRating,
  globalRank,
  countryRank,
  contestsParticipated = 0,
  stars = 0,
  streak = 0,
  details = {},
  syncStatus,
  syncError,
  color = "#739775",
  profileUrl,
  onDelete,
  onSync,
  isSyncing = false,
}) => {
  const hasDifficultyBreakdown =
    platform !== "github" &&
    (easySolved > 0 || mediumSolved > 0 || hardSolved > 0);

  return (
    <div className="platform-card-rich">
      <div className="platform-card-header">
        <div className="platform-card-brand">
          <div
            className="platform-logo-badge"
            style={{
              color: color,
              backgroundColor: `${color}20`,
              borderColor: `${color}40`,
            }}
          >
            {name.charAt(0)}
          </div>
          <div>
            <div className="platform-name-row">
              <h3 className="platform-title">{name}</h3>
              {syncStatus === "success" && (
                <span className="sync-badge success" title="Synced successfully">
                  <CheckCircle2 size={12} /> Live
                </span>
              )}
              {syncStatus === "failed" && (
                <span className="sync-badge error" title={syncError || "Sync failed"}>
                  <AlertCircle size={12} /> Sync Error
                </span>
              )}
            </div>
            <p className="platform-handle">
              {username ? `@${username}` : "Not connected"}
            </p>
          </div>
        </div>

        <div className="platform-actions">
          {onSync && (
            <button
              type="button"
              className="icon-button"
              onClick={onSync}
              disabled={isSyncing}
              aria-label={`Sync ${name}`}
              title={`Sync ${name}`}
            >
              <RefreshCw size={15} className={isSyncing ? "spin-animation" : ""} />
            </button>
          )}
          {profileUrl && (
            <a
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
              className="icon-button"
              aria-label={`Open ${name} profile`}
              title="Open profile in new tab"
            >
              <ExternalLink size={16} />
            </a>
          )}
          {onDelete && platformId && (
            <button
              type="button"
              className="icon-button delete"
              onClick={() => onDelete(platformId, name)}
              aria-label={`Unlink ${name}`}
              title="Unlink platform"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {syncStatus === "failed" && syncError && (
        <div className="platform-sync-error">
          <div className="platform-sync-error-content">
            <AlertCircle size={13} style={{ flexShrink: 0 }} />
            <span>{syncError}</span>
          </div>
          {onSync && (
            <button
              type="button"
              className="sync-retry-btn"
              onClick={onSync}
              disabled={isSyncing}
            >
              {isSyncing ? "Retrying..." : "Retry"}
            </button>
          )}
        </div>
      )}

      {/* Primary Key Metrics */}
      {platform === "github" ? (
        <div className="platform-metrics-grid">
          <div className="platform-metric">
            <span className="metric-label">Repositories</span>
            <strong className="metric-value">{details?.public_repos ?? solved}</strong>
            <span className="metric-sub">Public</span>
          </div>

          <div className="platform-metric">
            <span className="metric-label">Stars</span>
            <strong className="metric-value stars-highlight">
              <Star size={13} fill="#F59E0B" color="#F59E0B" /> {details?.totalStars ?? stars ?? rating ?? 0}
            </strong>
            <span className="metric-sub">Earned</span>
          </div>

          <div className="platform-metric">
            <span className="metric-label">Followers</span>
            <strong className="metric-value rank-highlight">
              {details?.followers ?? globalRank ?? 0}
            </strong>
            <span className="metric-sub">{details?.following ?? 0} Following</span>
          </div>
        </div>
      ) : (
        <div className="platform-metrics-grid">
          <div className="platform-metric">
            <span className="metric-label">Solved</span>
            <strong className="metric-value">{solved}</strong>
            <span className="metric-sub">Questions</span>
          </div>

          {rating != null && rating > 0 && (
            <div className="platform-metric">
              <span className="metric-label">Rating</span>
              <strong className="metric-value rating-highlight">{rating}</strong>
              <span className="metric-sub">
                {maxRating && maxRating > rating ? `Peak: ${maxRating}` : "Current"}
              </span>
            </div>
          )}

          {stars > 0 && (
            <div className="platform-metric">
              <span className="metric-label">Stars</span>
              <strong className="metric-value stars-highlight">
                <Star size={13} fill="#F59E0B" color="#F59E0B" /> {stars}★
              </strong>
              <span className="metric-sub">CodeChef</span>
            </div>
          )}

          {globalRank != null && globalRank > 0 && (
            <div className="platform-metric">
              <span className="metric-label">Global Rank</span>
              <strong className="metric-value rank-highlight">
                #{globalRank.toLocaleString()}
              </strong>
              <span className="metric-sub">
                {countryRank ? `Country: #${countryRank.toLocaleString()}` : "Worldwide"}
              </span>
            </div>
          )}

        </div>
      )}

      {/* Difficulty Breakdown / Badges Pills */}
      {hasDifficultyBreakdown && (
        <div className="difficulty-breakdown-row">
          <span className="diff-pill easy" title="Easy problems solved">
            Easy: <strong>{easySolved}</strong>
          </span>
          <span className="diff-pill medium" title="Medium problems solved">
            Med: <strong>{mediumSolved}</strong>
          </span>
          <span className="diff-pill hard" title="Hard problems solved">
            Hard: <strong>{hardSolved}</strong>
          </span>
        </div>
      )}

      {/* Additional Details Chips */}
      <div className="platform-chips-row">
        {platform === "github" && (
          <>
            {details?.totalForks > 0 && (
              <span className="platform-chip contest">
                <GitFork size={12} /> {details.totalForks} forks
              </span>
            )}
            {details?.bio && (
              <span className="platform-chip bio" title={details.bio}>
                {details.bio.length > 45
                  ? `${details.bio.slice(0, 45)}...`
                  : details.bio}
              </span>
            )}
          </>
        )}
        {contestsParticipated > 0 && (
          <span className="platform-chip contest">
            <Trophy size={12} /> {contestsParticipated} contests
          </span>
        )}
        {streak > 0 && (
          <span className="platform-chip streak">
            <Flame size={12} /> {streak} day streak
          </span>
        )}

      </div>
    </div>
  );
};

export default PlatformCard;
