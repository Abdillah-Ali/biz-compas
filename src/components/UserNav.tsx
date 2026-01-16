import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserNavProps {
  onSettingsClick: () => void;
}

export const UserNav = ({ onSettingsClick }: UserNavProps) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
              <User size={20} />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Profile & Account</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl border-slate-200">
        <div className="px-2 py-2 mb-1">
          <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
          <p className="text-xs text-slate-500 truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator className="bg-slate-100" />
        <DropdownMenuItem onClick={onSettingsClick} className="rounded-xl cursor-pointer py-2.5 focus:bg-slate-50">
          <Settings className="h-4 w-4 mr-3 text-slate-500" />
          <span className="font-medium text-slate-700">Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-100" />
        <DropdownMenuItem onClick={logout} className="rounded-xl cursor-pointer py-2.5 focus:bg-red-50 text-red-600 group">
          <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 mr-3 group-hover:bg-red-200 transition-colors">
            <LogOut className="h-4 w-4" />
          </div>
          <span className="font-medium">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
