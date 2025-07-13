# How to Use

```sh
npx pomodoro --at 0  # set timer at the next 10 minutes mark.
```

```sh
npx pomodoro --for 10  # set timer after 10 minutes.
```


Play beep sound at 30 minutes mark every hour.

```sh
npx pomodoro --at 30 --beep 'myBeep.mp3'
```


Prevent AI agent annoying you by frequent reports.

Of course just ignore pull requests from AI is another solution.

```batch
:LOOP

    :: your coding agent cli command
    my-coding-agent --prompt 'solve GitHub issues.'

    :: report every hour, not frequent.
    npx pomodoro --at 30 --beep 'myBeep.mp3'

    goto :LOOP
```



# License

MIT License.
