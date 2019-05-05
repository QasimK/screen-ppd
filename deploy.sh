#!/usr/bin/env sh

echo "Checking if we can execute the release script..."

git fetch

if [[ $(git rev-parse --abbrev-ref HEAD) != 'master' ]]; then
  echo 'NO - you must deploy from the master branch.'
  exit 1
fi

if [[ $(git rev-parse HEAD) != $(git rev-parse origin/master) ]]; then
  echo 'NO - master must match origin/master.'
  exit 1
fi

if [[ -n $(git diff --stat) ]]; then
  echo 'NO - working tree is dirty.'
  exit 1
fi

if [[ -n $(git status -s) ]]; then
  echo 'NO - working tree has modified/untracked files.'
  exit 1
fi

echo "We can start the release process!"
echo "Starting Release..."
echo ""

MESSAGE="Release from $(git rev-parse HEAD)" \
&& npm run build \
&& git subtree split --prefix dist -b gh-pages -m "$MESSAGE" \
&& git push origin gh-pages:gh-pages
&& echo ""
&& echo "...Completed Release."
