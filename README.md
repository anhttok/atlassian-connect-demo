# Atlassian Add-on using Express

Congratulations! You've successfully created an Atlassian Connect App using
the Express web application framework.

# Installation

1. Install [git], [node], [npm] \(2.7.5+) and [ngrok].
2. Run `npm install`.
3. Run `ngrok http 3000` and take note of the proxy's `https://..` base url.
4. Run `AC_LOCAL_BASE_URL=https://THE_NGROK_BASE_URL node app.js` from the
repository root.
