/**
 * @file WindowsAudioPlayer.ts
 * @brief Windows環境で音声ファイルを再生するためのクラスを提供します。
 * @copyright Sator Imaging
 */

import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

/**
 * @brief Windows環境で音声ファイルを再生するためのクラスです。
 */
export class WindowsAudioPlayer {
    private readonly execPromise = promisify(exec);

    /**
     * @brief 指定された音声ファイルを再生します。
     * @param filePath 再生する音声ファイルのパス。
     * @returns 音声再生コマンドの実行結果。
     * @throws {Error} ファイルパスが無効な場合、または音声ファイルの再生に失敗した場合。
     */
    public async play(filePath: string): Promise<string> {
        if (!filePath || filePath.trim() === '') {
            throw new Error('ファイルパスは必須です。');
        }

        filePath = path.resolve(filePath).replaceAll('\\', '/');  // must be posix style path.

        // PowerShellコマンドを構築
        // Add-Type -AssemblyName presentationCore は、PowerShellセッション内でWPFのPresentationCoreアセンブリをロードします。
        // これにより、System.Windows.Media.MediaPlayerクラスを使用できるようになります。
        // $player = New-Object System.Windows.Media.MediaPlayer は、MediaPlayerクラスの新しいインスタンスを作成し、$player変数に格納します。
        // $player.Open('file://C:/path/to/your/audio.mp3') は、再生する音声ファイルのURIを設定します。
        // file:// スキームを使用し、絶対パスを指定する必要があります。
        // $player.Play() は、音声の再生を開始します。
        // Start-Sleep -s ($player.NaturalDuration.TimeSpan.TotalSeconds + 1) は、音声ファイルの再生が終了するまでPowerShellスクリプトを一時停止します。
        // +1秒は、再生終了とスクリプト終了の間のわずかな遅延を考慮するためです。
        // $player.Close() は、MediaPlayerオブジェクトを閉じ、関連するリソースを解放します。
        const powershellCommand = `
            param([string]$AudioFilePath)
            Add-Type -AssemblyName presentationCore;
            $player = New-Object System.Windows.Media.MediaPlayer;
            $url = [Uri][System.IO.Path]::GetFullPath($AudioFilePath);
            echo $url;
            $player.Open($url);
            $player.Play();
            Start-Sleep -s ($player.NaturalDuration.TimeSpan.TotalSeconds + 1);
            $player.Close();
        `;

        try {
            const { stdout, stderr } = await this.execPromise(
                `powershell.exe -Command "& { ${powershellCommand.replace(/\r?\n/g, ' ')} }" -AudioFilePath '${filePath}'`);
            if (stderr) {
                throw new Error(`PowerShellエラー: ${stderr}`);
            }
            return stdout;
        } catch (error: any) {
            throw new Error(`音声ファイルの再生に失敗しました: ${error.message}`);
        }
    }
}
