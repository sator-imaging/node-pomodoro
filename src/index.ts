#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { PomodoroApp } from './PomodoroApp.js';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * メインエントリポイント
 */
async function main(): Promise<void> {
  const argv = await yargs(hideBin(process.argv))
    .usage(`使い方: $0 [オプション]

ポモドーロタイマーを実行します。`)
    .option('at', {
      type: 'number',
      description: '指定した時刻（分針、0-59）にタイマーを設定します。例: `--at 30`。`--for` とは同時に使用できません。',
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
    .help('h')
    .alias('h', 'help')
    .version('v', JSON.parse(readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../package.json'), 'utf8')).version)
    .alias('v', 'version')
    .check((argv) => {
      if (typeof argv.at !== 'number' && typeof argv.for !== 'number') {
        throw new Error('`--at` または `--for` のいずれかのオプションが必要です。');
      }
      if (argv.at !== undefined && (argv.at < 0 || argv.at > 59)) {
        throw new Error('`--at` は 0 から 59 の間の値である必要があります。');
      }
      if (argv.for !== undefined && argv.for < 0) {
        throw new Error('`--for` は 0 またはそれより大きい値である必要があります。');
      }
      return true;
    })
    .strict()
    .parse();

  const app = new PomodoroApp(argv.beep);

  if (typeof argv.at === 'number') {
    await app.startAt(argv.at);
  } else if (typeof argv.for === 'number') {
    await app.startFor(argv.for);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
