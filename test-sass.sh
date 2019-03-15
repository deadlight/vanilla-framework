count=0
errors=0
files_with_errors

for file in ./scss/*; do
    if [ -f "$file" ]; then
      if [ "$file" != "./scss/build.scss" ]; then
          printf "======================================================\n"
          printf "Testing $file\n"
          printf "======================================================\n"
          ./node_modules/node-sass/bin/node-sass "$file"
          if [ $? = "1" ]; then
            errors=$((errors+1))
            files_with_errors="$files_with_errors\n$file"
            printf "======================================================\n"
            printf "Error: sass build failed for $file\n"
          fi
          printf "======================================================\n\n\n"
          count=$((count+1))
      fi
    fi
done

printf "TOTAL FILES TESTED: $count\n"
printf "FILES WITH ERRORS:  $errors\n"
printf "$files_with_errors\n"
