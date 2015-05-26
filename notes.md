// ignore sub folders
 RewriteCond %{REQUEST_URI} "/folder1/" [OR]
  RewriteCond %{REQUEST_URI} "/folder2/"
  RewriteRule (.*) $1 [L]

  or
  RewriteRule .* - [L]

  RewriteBase /