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
import { type NetworkConfig, ROUTES } from "@/constant";
import { money } from "@/lib/format";
import { Link } from "@tanstack/react-router";
import { Copy, Wallet } from "lucide-react";

type OverviewBalanceUiProps = {
  balance: number;
  network: NetworkConfig;
  address?: string;
  passkeyEnabled: boolean;
  onCopyAddress: () => void;
  onAddFunds: () => void;
};

const OverviewBalanceUi = ({
  balance,
  network,
  address,
  passkeyEnabled,
  onCopyAddress,
  onAddFunds,
}: OverviewBalanceUiProps) => {
  const { t } = useTranslation("overview-page");
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
      <div>
        <div className="flex flex-wrap items-center gap-2 text-body text-muted-foreground">
          <span>{t("balance.title", { chain: network.name })}</span>
          <span className="border px-1.5 py-0.5 text-small">{network.testnetName}</span>
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="font-display text-figure leading-none font-semibold tabular-nums">
            {money(balance)}
          </span>
          <span className="text-body text-muted-foreground">
            {network.token.symbol}
          </span>
        </div>
        <p className="mt-4 text-small text-muted-foreground">
          {passkeyEnabled ? t("balance.passkey-on") : t("balance.passkey-off")}{" "}
          <Link to={ROUTES.SETTINGS} className="underline underline-offset-2 hover:text-foreground">
            {t("balance.passkey-manage")}
          </Link>
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onAddFunds}>
          {t("labels.add-funds")}
        </Button>
        {address && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="px-4">
                <Wallet className="size-4" strokeWidth={1.4} />{" "}
                {t("balance.wallet")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>{t("balance.wallet")}</DropdownMenuLabel>
              <DropdownMenuItem onSelect={onCopyAddress}>
                <span className="font-mono text-caption">
                  <ShortAddress value={address} />
                </span>
                <Copy className="ml-auto size-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default OverviewBalanceUi;
