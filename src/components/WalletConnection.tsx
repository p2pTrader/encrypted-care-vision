import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Activity, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { NewRecordModal } from './NewRecordModal';

interface WalletConnectionProps {
  onConnect?: (address: string) => void;
}

export const WalletConnection = ({ onConnect }: WalletConnectionProps) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleConnect = (address: string) => {
    onConnect?.(address);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleRecordCreated = (recordId: number) => {
    console.log(`New medical record created with ID: ${recordId}`);
    // You can add additional logic here, such as refreshing data or showing notifications
  };

  return (
    <Card className="shadow-card border-primary/10">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg">Patient Identity</CardTitle>
            <CardDescription>
              Secure wallet connection for patient ID linking
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Your wallet address serves as your secure patient identifier</span>
            </div>
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <Button 
                            onClick={openConnectModal}
                            variant="wallet"
                            size="medical"
                            className="w-full"
                          >
                            <Wallet className="h-4 w-4" />
                            Connect Wallet
                          </Button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <Button 
                            onClick={openChainModal}
                            variant="destructive"
                            size="medical"
                            className="w-full"
                          >
                            Wrong network
                          </Button>
                        );
                      }

                      return (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-accent/20 border border-accent">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-success" />
                              <span className="text-sm font-medium">Connected</span>
                            </div>
                            <Badge variant="outline" className="text-xs font-mono">
                              {account.displayName}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Activity className="h-4 w-4" />
                            <span>Your medical data is now linked to your secure identity</span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={openAccountModal}
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              Account
                            </Button>
                            <NewRecordModal onRecordCreated={handleRecordCreated} />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/20 border border-accent">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Connected</span>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                {address}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Your medical data is now linked to your secure identity</span>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleDisconnect}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Disconnect Wallet
              </Button>
              <NewRecordModal onRecordCreated={handleRecordCreated} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};