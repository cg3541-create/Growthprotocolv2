import { X, Check, Sparkles, Zap, Shield, Rocket } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const features = [
    {
      name: "Agent Deployment",
      basic: false,
      premium: true,
      icon: Rocket
    },
    {
      name: "Automated Workflows",
      basic: false,
      premium: true,
      icon: Zap
    },
    {
      name: "Advanced Analytics",
      basic: false,
      premium: true,
      icon: Sparkles
    },
    {
      name: "Priority Support",
      basic: false,
      premium: true,
      icon: Shield
    },
    {
      name: "Basic AI Responses",
      basic: true,
      premium: true,
      icon: Check
    },
    {
      name: "Database Access",
      basic: true,
      premium: true,
      icon: Check
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#1a1a1a] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#0466C8]" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription className="text-[#666666]">
            Unlock powerful agent automation and advanced features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Feature Comparison */}
          <div>
            <h3 className="text-sm font-semibold text-[#333333] mb-4">Feature Comparison</h3>
            <div className="space-y-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-[#f9f9f9] rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#0466C8]" />
                      <span className="text-sm text-[#333333]">{feature.name}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${
                        feature.basic ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {feature.basic ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${
                        feature.premium ? 'bg-[#0466C8]' : 'bg-gray-100'
                      }`}>
                        {feature.premium ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <X className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-br from-[#0466C8] to-[#0353a4] rounded-lg p-6 text-white">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold">$99</span>
              <span className="text-blue-100">/month</span>
            </div>
            <p className="text-blue-100 text-sm mb-4">
              Or $999/year (save 16%)
            </p>
            <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Unlimited agent deployments
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Advanced workflow automation
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Priority support & updates
              </li>
            </ul>
            <Button
              onClick={() => {
                // TODO: Implement upgrade flow
                console.log('Upgrade to Premium clicked');
                alert('Upgrade flow would be implemented here');
              }}
              className="w-full bg-white text-[#0466C8] hover:bg-blue-50 font-semibold py-3 rounded-lg transition-colors"
            >
              Upgrade to Premium
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-xs text-[#999999] text-center">
            <p>Questions? Contact our sales team at sales@growthprotocol.com</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

