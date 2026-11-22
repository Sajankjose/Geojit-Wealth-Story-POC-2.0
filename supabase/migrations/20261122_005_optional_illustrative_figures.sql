-- POC 2.7.1 — deliberately fictional financial illustration figures.
-- OPTIONAL demo seed. Run only in the synthetic Geojit Wealth Story POC database.
-- These ARE NOT client financial values and are NOT production-verified.
-- They pass the POC's SOURCE-VERIFIED DEMO fixture gate so the experience can
-- display consistent rupee figures. Never mix this data with live accounts.
-- The source IDs below are fictional and not linked to market feeds.
BEGIN;
INSERT INTO public.poc_records(record_id,client_id,domain,source_id,event_at,payload)
SELECT x.record_id,x.client_id,x.domain,'DEMO_VALUATION', '2026-11-20T16:00:00+05:30'::timestamptz, x.payload::jsonb
FROM (VALUES
 ('demo_metric_thomas_equity','C012','product_subscriptions','{"metric_type":"equity_value","value":324000,"currency":"INR","verified":true,"source_verified":true,"scope":"geojit_accounts","as_of":"2026-11-20","product_type":"Equity","status":"active","demo_fixture":true}'),
 ('demo_metric_thomas_mf','C012','product_subscriptions','{"metric_type":"mutual_fund_value","value":218000,"currency":"INR","verified":true,"source_verified":true,"scope":"geojit_accounts","as_of":"2026-11-20","product_type":"Mutual funds","status":"active","demo_fixture":true}'),
 ('demo_metric_thomas_total','C012','product_subscriptions','{"metric_type":"current_value","value":542000,"currency":"INR","verified":true,"source_verified":true,"scope":"geojit_accounts","as_of":"2026-11-20","product_type":"Illustrative holdings","status":"active","demo_fixture":true}'),
 ('demo_metric_george_mf','C014','product_subscriptions','{"metric_type":"mutual_fund_value","value":968000,"currency":"INR","verified":true,"source_verified":true,"scope":"geojit_accounts","as_of":"2026-11-20","product_type":"Mutual funds","status":"active","demo_fixture":true}')
) AS x(record_id,client_id,domain,payload)
JOIN public.poc_clients c ON c.client_id=x.client_id AND c.synthetic=true
ON CONFLICT(record_id) DO NOTHING;
COMMIT;

-- Verify manually:
-- SELECT client_id,record_id,payload->>'metric_type' AS metric_type,
--        payload->>'value' AS illustrative_inr
-- FROM public.poc_records WHERE source_id='DEMO_VALUATION'
-- ORDER BY client_id,record_id;
