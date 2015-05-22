# This script will regenerate the stats from the merge commits to the master
# branch of this repository. This script is only saved in case of catastrophic
# loss of the stats stored in the history.

# output directory
dir=docs/stats
# stats library
lib=node_modules/.bin/plato
# source directory
src=src

# save the current HEAD commit SHA-1, so we can return to it easily at the end
head=$(git log -1 --pretty=oneline | awk '{print $1}')

# start from nothing as the stats build over "time"
rm -rf "$dir"

# loop over the SHA-1s of all the merge commits to the master branch
for i in $( git log --merges --first-parent --reverse --pretty=oneline | awk '{print $1}' ); do
  # remove the current source code to not taint results
  rm -rf "$src"
  # checkout sha version of the source code
  git checkout $i -- "$src"
  # only add stats if there is a src/ directory; otherwise the stats will have errors
  if [ -d "$src" ]; then
    # get the date of the commit to make the stats report on the date of commit
    date=$(git log -1 $i --pretty=format:"%ad" --)
    # run plato stats
    node $lib -D "$date" --dir $dir "$src/**.js"
  fi
done

# reset to the location from which the script started
git reset --hard $head --

# run the report one last time
node $lib -d $dir "$src/**.js"
