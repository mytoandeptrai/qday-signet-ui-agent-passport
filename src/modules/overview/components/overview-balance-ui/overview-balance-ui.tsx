import ShortAddress from "@/components/ui/short-address";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/integrations/i18n";
import { NETWORKS } from "@/constant";
import { money } from "@/lib/format";
import type { SignetPass } from "@/types/passport";
import { Copy, Wallet } from "lucide-react";

type OverviewBalanceUiProps = {
  available: number;
  pass?: SignetPass | null;
  onCopyAddress: () => void;
  onAddFunds: () => void;
};

const OverviewBalanceUi = ({
  available,
  pass,
  onCopyAddress,
  onAddFunds,
}: OverviewBalanceUiProps) => {
  const { t } = useTranslation("overview-page");
  return (
    <>
      <div className="text-body text-muted-foreground">
        {pass
          ? t("balance.title-named", {
              name: pass.name,
              token: NETWORKS[pass.network].token.symbol,
            })
          : t("balance.title")}
      </div>
      <div className="mt-1.5 font-display text-figure leading-none font-semibold tabular-nums">
        {money(available)}
      </div>
      <div className="mt-5 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onAddFunds}>
          {t("labels.add-funds")}
        </Button>
        {pass && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="px-4">
                <Wallet className="size-4" strokeWidth={1.4} />{" "}
                {t("balance.wallet")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>{pass.name}</DropdownMenuLabel>
              <DropdownMenuItem onSelect={onCopyAddress}>
                <span className="font-mono text-caption">
                  <ShortAddress value={pass.address} />
                </span>
                <Copy className="ml-auto size-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </>
  );
};

export default OverviewBalanceUi;
