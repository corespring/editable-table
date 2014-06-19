#!/usr/bin/env ruby

tmp = "../tmp-ww-site"

`harp compile site/ #{tmp}`
sleep 1

`rm #{tmp}/.gitignore`
sleep 1

`cp -rf dist/ #{tmp}/dist`
sleep 1

`cp -rf angular-bootstrap/ #{tmp}/angular-bootstrap`
sleep 1

`git checkout gh-pages`
sleep 4

puts `git status`

`cp -fr #{tmp}/ .`
sleep 1

`git add --all`
sleep 1

`git commit . -m "site build"`
sleep 1

`git push origin gh-pages`
sleep 1

`git checkout master`