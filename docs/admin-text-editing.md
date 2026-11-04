# Editing page text

Open a location, service, or city-specific service page from `/admin`.

- Click headings and paragraphs to edit existing content fields directly.
- Click other wording, including a button or link label, to open its text editor.
- Open **All text** to search every text entry on that page. This includes form labels, placeholders, dropdown options, image descriptions, accessible labels, navigation and footer copy. Each entry can be restored to its original wording.
- Select **Use controls** to open a menu, FAQ or booking panel, then select **Edit text** to edit the newly revealed wording. Alt-click also opens buttons/FAQs while editing. Navigation and form submission stay blocked in the preview.
- Select **Save changes** to publish through the existing authenticated MongoDB save API. Changes to shared headers and footers apply to the current page.

## Storage and rendering

Structured content remains in its existing document fields. Other copy is stored as `textOverrides` in the same page document. Each override identifies a text node or an allowed text attribute by its DOM location and original wording. Duplicate wording can be edited independently. Text replacement preserves icons, inline markup, link destinations and dropdown submission values. No HTML is accepted.

Each managed page supplies its overrides to `AdminPreviewGuard`. On public pages, overrides apply after client hydration and are reapplied when interactive content mounts or rerenders. Pages without overrides do not install a public observer. Generic overrides do not change server-rendered metadata or JSON-LD; existing structured fields continue to render on the server. If a template update moves/replaces the source wording, a mismatched override is skipped rather than applied to unrelated copy; reopen the editor to update it.

Saving requires a working MongoDB connection. Connection failures remain visible as save errors; edits are never reported as published when saving fails.

## Verification

Run `npm run test:page-text` for the isolated DOM and mocked API/database round-trip tests. They exercise the actual editor component, text catalogs, button editing, SVG preservation, placeholders, options, blank copy, control mode, newly mounted text, validation, authentication and correct city-service cache revalidation. They never write to a live database. Run `npm run typecheck` and `npm run build` for the application checks.

## Save connection errors

A TLS/SSL save error means the app could not establish a secure connection to MongoDB. Changes are not published on failure. The editor retains its current unsaved data and offers **Retry save** for temporary connection failures. Keep the page open while resolving the connection.

Check the Atlas cluster status and the project's IP access list for the machine running Next.js. The connection string does not grant access to Atlas project/network settings. TLS rejection alone does not prove which Atlas or network setting is responsible. See [Atlas connection troubleshooting](https://www.mongodb.com/docs/atlas/troubleshoot-connection/).

Run `npm run db:check` for a read-only ping/authentication check without printing credentials. The application now discards a rejected connection promise, so a later Save can reconnect once the underlying issue is resolved. TLS verification remains enabled. Run `npm run test:save` to verify pool recovery, retry behavior and failure handling without a live database.
