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
import { NETWORKS, ROUTES } from "@/constant";
import { money } from "@/lib/format";
import type { SignetPass } from "@/types/passport";
import { Link } from "@tanstack/react-router";
import { Copy, Wallet } from "lucide-react";

type OverviewBalanceUiProps = {
  available: number;
  pass?: SignetPass | null;
  passkeyEnabled: boolean;
  onCopyAddress: () => void;
  onAddFunds: () => void;
};

const OverviewBalanceUi = ({
  available,
  pass,
  passkeyEnabled,
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
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="font-display text-figure leading-none font-semibold tabular-nums">
          {money(available)}
        </span>
        {pass && (
          <span className="text-body text-muted-foreground">
            {NETWORKS[pass.network].token.symbol}
          </span>
        )}
      </div>
      <div className="mt-5 flex gap-2">
        <Button variant="outline" onClick={onAddFunds}>
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
      <p className="mt-4 text-small text-muted-foreground">
        {passkeyEnabled ? t("balance.passkey-on") : t("balance.passkey-off")}{" "}
        <Link to={ROUTES.SETTINGS} className="underline underline-offset-2 hover:text-foreground">
          {t("balance.passkey-manage")}
        </Link>
      </p>
    </>
  );
};

export default OverviewBalanceUi;
