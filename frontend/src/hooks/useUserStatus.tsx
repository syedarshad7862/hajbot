import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";

interface UserStatus {
  isBlocked: boolean;
  blockMessage: string | null;
}

export const useUserStatus = () => {
  const { user } = useAuth();
  const [status] = useState<UserStatus>({
    isBlocked: user?.isBlocked ?? false,
    blockMessage: user?.isBlocked ? "Chat access disabled by admin" : null,
  });
  const [loading] = useState(false);

  const updateLastSeen = useCallback(async () => {
    // This would be handled by your Express.js backend
    // You can add an endpoint like /user/update-last-seen if needed
  }, []);

  return { 
    isBlocked: status.isBlocked, 
    blockMessage: status.blockMessage, 
    loading, 
    updateLastSeen 
  };
};
