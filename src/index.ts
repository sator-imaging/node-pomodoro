import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { PomodoroApp } from './PomodoroApp.js';

/**
 * メインエントリポイント
 */
async function main(): Promise<void> {
  const argv = await yargs(hideBin(process.argv))
    .usage(`使い方: $0 [オプション]
ポモドーロタイマーを実行します。`)
    .help('h')
    .alias('h', 'help')
    .version('v', '1.0.0') // package.jsonからバージョンを読み込むことも可能
    .alias('v', 'version')
    .option('at', {
      type: 'number',
      description: '指定した時刻（分、0-59）にタイマーを設定します。例: `--at 30`。現在時刻より前の分を指定した場合、翌日の同じ時刻に設定されます。`--for` とは同時に使用できません。',
      conflicts: 'for',
    })
    .option('for', {
      type: 'number',
      description: '指定した分数後にタイマーを終了します。例: `--for 25`。`--at` とは同時に使用できません。',
      conflicts: 'at',
    })
    .option('beep', {
      type: 'string',
      description: 'タイマー終了時に再生する音声ファイルのパスを指定します。ファイルが見つからない場合でもエラーにはなりません。',
    })
    .check((argv) => {
      if (!argv.at && !argv.for) {
        throw new Error('`--at` または `--for` のいずれかのオプションが必要です。');
      }
      if (argv.at !== undefined && (argv.at < 0 || argv.at > 59)) {
        throw new Error('`--at` は 0 から 59 の間の値である必要があります。');
      }
      if (argv.for !== undefined && argv.for <= 0) {
        throw new Error('`--for` は 0 より大きい値である必要があります。');
      }
      return true;
    })
    .parse();

  const app = new PomodoroApp(argv.beep);

  if (argv.at) {
    await app.startAt(argv.at);
  } else if (argv.for) {
    await app.startFor(argv.for);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
