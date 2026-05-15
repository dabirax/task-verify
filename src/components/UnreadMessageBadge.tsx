import { useConversations } from '../hooks/useMessages';
import { Badge } from './ui/badge';

export function UnreadMessageBadge() {
  const { data: conversations } = useConversations();

  const unreadCount =
    conversations?.reduce((sum, conv) => sum + conv.unread_count, 0) ?? 0;

  if (unreadCount === 0) return null;

  return (
    <Badge className="bg-red-600 hover:bg-red-700 text-white absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center p-0 text-xs font-bold">
      {unreadCount > 99 ? '99+' : unreadCount}
    </Badge>
  );
}
