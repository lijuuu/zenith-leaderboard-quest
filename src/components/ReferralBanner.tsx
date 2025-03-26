
import { useState } from 'react';
import { Share, Copy, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const ReferralBanner = () => {
  const [isCopied, setIsCopied] = useState(false);
  const referralCode = 'ZENX-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const referralLink = `https://zenx.com/ref/${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    toast({
      title: "Referral link copied!",
      description: "Share with your friends to clear your recent inactivity.",
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };
  
  return (
    <Card className="border-green-500/20 bg-green-50/50 dark:bg-green-950/10 backdrop-blur-sm dark:border-green-500/10 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.15),transparent_50%)] pointer-events-none" />
      
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="bg-green-500 text-white p-1.5 rounded-full">
            <Share className="h-4 w-4" />
          </div>
          Clear Recent Inactivity
        </CardTitle>
        <CardDescription>
          Refer a friend to instantly clean up your activity heatmap and earn bonus points
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-green-500" />
            <span className="opacity-90">
              Each successful referral will replace 5 inactive days with activity
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:outline-none pr-10"
              />
              <button 
                onClick={copyToClipboard}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                aria-label="Copy referral link"
              >
                {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            
            <Button 
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium flex-shrink-0"
              onClick={copyToClipboard}
            >
              {isCopied ? 'Copied!' : 'Copy & Share'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralBanner;
