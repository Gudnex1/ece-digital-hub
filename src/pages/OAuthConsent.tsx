import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};
const oauth = (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) return setError("Missing authorization_id");
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) return setError(error.message);
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) { window.location.href = immediate; return; }
      setDetails(data);
    })();
    return () => { active = false; };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorizationId)
      : await oauth.denyAuthorization(authorizationId);
    if (error) { setBusy(false); return setError(error.message); }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) { setBusy(false); return setError("No redirect URL returned."); }
    window.location.href = target;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        {error ? (
          <>
            <CardHeader><CardTitle>Authorization error</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">{error}</p></CardContent>
          </>
        ) : !details ? (
          <CardContent className="py-10 text-center text-sm text-muted-foreground">Loading…</CardContent>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Connect {details.client?.name ?? "an app"} to ECE Digital Hub</CardTitle>
              <CardDescription>
                This lets {details.client?.name ?? "the client"} use ECE Digital Hub as you. It does not bypass this app's admin permissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" disabled={busy} onClick={() => decide(true)}>Approve</Button>
              <Button className="w-full" variant="outline" disabled={busy} onClick={() => decide(false)}>Cancel connection</Button>
            </CardContent>
          </>
        )}
      </Card>
    </main>
  );
}