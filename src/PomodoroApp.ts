/**
 * ポモドーロタイマーアプリケーションのコアロジックを管理するクラス。
 */
import { WindowsAudioPlayer } from './WindowsAudioPlayer.js';

/**
 * 指定されたミリ秒数だけ遅延します。
 * @param ms - 遅延するミリ秒数。
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * ポモドーロタイマーアプリケーションのコアロジックを管理するクラス。
 */
export class PomodoroApp {
  private _beepFilePath: string | undefined;

  constructor(beepFilePath?: string) {
    this._beepFilePath = beepFilePath;
  }

  private async _playBeep(): Promise<void> {
    if (this._beepFilePath) {
      const player = new WindowsAudioPlayer();
      try {
        await player.play(this._beepFilePath);
      } catch (error: any) {
        console.error(`ビープ音の再生中にエラーが発生しました: ${error.message}`);
      }
    }
  }

  /**
   * 指定した時刻（分）にタイマーを開始します。
   * @param minute - タイマーを起動する分（0-59）。
   * @throws {Error} minute が無効な場合にスローされます。
   */
  public async startAt(minute: number): Promise<void> {
    if (minute < 0 || minute > 59) {
      throw new Error('minute は 0 から 59 の間の値である必要があります。');
    }

    const now = new Date();
    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), minute, 0, 0);

    // もし指定された時刻が現在時刻より前の場合、翌日の同じ時刻に設定します。
    if (targetTime.getTime() <= now.getTime()) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    const delayMs = targetTime.getTime() - now.getTime();

    console.log(`${targetTime.toLocaleTimeString()} にタイマーが設定されました。`);

    await delay(delayMs);
    console.log('時間になりました！');
    await this._playBeep();
  }

  /**
   * 指定した分数後にタイマーを開始します。
   * @param minutes - タイマーを起動する分数。
   * @throws {Error} minutes が無効な場合にスローされます。
   */
  public async startFor(minutes: number): Promise<void> {
    if (minutes <= 0) {
      throw new Error('minutes は 0 より大きい値である必要があります。');
    }

    const delayMs = minutes * 60 * 1000; // 分をミリ秒に変換

    console.log(`${minutes} 分後にタイマーが設定されました。`);

    await delay(delayMs);
    console.log('時間になりました！');
    await this._playBeep();
  }
}
