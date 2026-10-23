import { Inbox } from "lucide-react";

const EmptyState = ({
  title = "Nothing here yet",
  description = "Your activity will appear here when you get started.",
  action,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Inbox size={30} />
      </div>

      <h3>{title}</h3>
      <p>{description}</p>

      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
};

export default EmptyState;
