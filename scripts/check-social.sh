#!/usr/bin/env bash
# Prove every URL in SOCIAL (site.ts) actually lands on a Radlor PROFILE.
#
#   scripts/check-social.sh
#
# ⚠️ WHY THIS EXISTS. `SOCIAL` feeds `Organization.sameAs`, and we deliberately put our own
# `*.radlor.com` GoDaddy forwards in it rather than the raw profile URLs — so the links are ours
# and a handle change is a DNS edit, not a deploy. The price is that the strongest GEO signal on
# the site now depends on four rows in a GoDaddy panel that nothing in the repo can see.
#
# The failure mode is silent and expensive: a forward pointed at `https://www.facebook.com`
# instead of the profile still 301s, still looks configured, and tells every answer engine that
# the entity called Radlor is FACEBOOK. So this follows each redirect to the end and refuses
# anything that lands on a bare homepage.
#
# ⚠️ It checks WHERE a link goes, not WHOSE the profile is. `instagram.com/radlor` was an
# unrelated account with 818 followers as of 2026-08-19 — a human still has to confirm each
# destination is ours the first time it is set.
set -euo pipefail

cd "$(dirname "$0")/.."

URLS=()
while IFS= read -r u; do [ -n "$u" ] && URLS+=("$u"); done < <(
  grep -o "url: '[^']*'" site.ts | sed "s/url: '//;s/'//")
[ ${#URLS[@]} -gt 0 ] || { echo "SOCIAL is empty — nothing to check"; exit 0; }

fail=0
for u in "${URLS[@]}"; do
  # -L follows the chain; %{url_effective} is where it stopped.
  final=$(curl -sSL -o /dev/null -m 20 -w '%{url_effective}' "$u" 2>/dev/null) || {
    echo "  ❌ $u → unreachable (SSL still provisioning? try again in an hour)"; fail=1; continue; }
  # Everything after the host. A homepage leaves this empty or "/".
  path=${final#*://}; path=/${path#*/}
  [ "$path" = "/${final#*://}" ] && path=/          # no slash at all → bare host
  case "$path" in
    /|'') echo "  ❌ $u → $final  (platform HOMEPAGE — point this forward at the profile)"; fail=1 ;;
    *)    echo "  ok  $u → $final" ;;
  esac
done

[ $fail -eq 0 ] || { echo "❌ not safe to deploy — a homepage corroborates the wrong entity, an unreachable URL is a dead sameAs"; exit 1; }
echo "✅ all ${#URLS[@]} social links land on a profile"
