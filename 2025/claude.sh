ls -1 | grep -v claude | grep -v 02 | grep -v 01 | grep -v 12 | while read n
do
    cd $n
    cat .meta | grep 'part=>1' && echo solving $n && claude --dangerously-skip-permissions -p "Please try to solve the first part of the puzzle in the markdown file in this directory. Read $n.md, Write code in solve.ts to solve the first part, Run `bun solve.ts` to run your code. Once you've got the answer, run "'`aoc -s "$answer"`'" to see if you're right." || echo $n solved already &
    cd ..
done