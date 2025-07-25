[![npmjs.com](https://img.shields.io/npm/v/pomodoro-beep)](https://www.npmjs.com/package/pomodoro-beep)
&nbsp;
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/sator-imaging/node-pomodoro)


# How to Use

```sh
npx pomodoro-beep --at 10  # set timer at the next 10 minutes mark.
```

```sh
npx pomodoro-beep --for 10  # set timer after 10 minutes.
```


Play beep sound at 30 minutes mark every hour.

```sh
npx pomodoro-beep --at 30 --beep 'myBeep.mp3'
```


How to prevent AI agent annoying you by frequent reports.
Of course just ignore pull requests from AI is another solution.

```batch
:LOOP

    :: your coding agent cli command
    my-coding-agent --prompt "solve GitHub open issues."

    :: report every hour, not frequent.
    npx pomodoro-beep --at 30 --beep "myBeep.mp3"

    goto :LOOP
```



# TODO

- Support direct playback of `https` resource.
- Message text internationalization.



# License

MIT License.
