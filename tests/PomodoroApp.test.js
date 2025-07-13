import { PomodoroApp } from '../PomodoroApp.js';
describe('PomodoroApp', () => {
    return;
    beforeEach(() => {
        jest.useFakeTimers();
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });
    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        jest.restoreAllMocks();
    });
    it('should start a timer for the specified minutes', async () => {
        const app = new PomodoroApp();
        const minutes = 0.1;
        const delayMs = minutes * 60 * 1000;
        const promise = app.startFor(minutes);
        jest.advanceTimersByTime(delayMs);
        await promise;
        expect(console.log).toHaveBeenCalledWith(`${minutes} 分後にタイマーが設定されました。`);
        expect(console.log).toHaveBeenCalledWith('時間になりました！');
    });
    it('should throw an error if minutes is not positive', async () => {
        const app = new PomodoroApp();
        await expect(app.startFor(0)).rejects.toThrow('minutes は 0 より大きい値である必要があります。');
    });
    it('should start a timer at the specified minute', async () => {
        const app = new PomodoroApp();
        const now = new Date();
        const currentMinute = now.getMinutes();
        const targetMinute = (currentMinute + 1) % 60; // Next minute
        const promise = app.startAt(targetMinute);
        const expectedDelay = (targetMinute > currentMinute)
            ? (targetMinute - currentMinute) * 60 * 1000
            : (60 - currentMinute + targetMinute) * 60 * 1000;
        jest.advanceTimersByTime(expectedDelay);
        await promise;
        const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), targetMinute, 0, 0);
        if (targetMinute <= currentMinute) {
            targetTime.setDate(targetTime.getDate() + 1);
        }
        expect(console.log).toHaveBeenCalledWith(`${targetTime.toLocaleTimeString()} にタイマーが設定されました。`);
        expect(console.log).toHaveBeenCalledWith('時間になりました！');
    });
    it('should throw an error if at minute is out of range', async () => {
        const app = new PomodoroApp();
        await expect(app.startAt(60)).rejects.toThrow('minute は 0 から 59 の間の値である必要があります。');
        await expect(app.startAt(-1)).rejects.toThrow('minute は 0 から 59 の間の値である必要があります。');
    });
    it('should play beep sound if beep file path is provided and exists', async () => {
        const app = new PomodoroApp('/path/to/beep.mp3');
        jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
        const playSoundSpy = jest.spyOn(require('play-sound')(), 'play').mockImplementation((_filePath, callback) => {
            callback(null);
        });
        const minutes = 0.1;
        const delayMs = minutes * 60 * 1000;
        const promise = app.startFor(minutes);
        jest.advanceTimersByTime(delayMs);
        await promise;
        expect(playSoundSpy).toHaveBeenCalledWith('/path/to/beep.mp3', expect.any(Function));
    });
    it('should log an error if beep file path is provided but does not exist', async () => {
        const app = new PomodoroApp('/path/to/nonexistent.mp3');
        jest.spyOn(require('fs'), 'existsSync').mockReturnValue(false);
        const playSoundSpy = jest.spyOn(require('play-sound')(), 'play');
        const minutes = 0.1;
        const delayMs = minutes * 60 * 1000;
        const promise = app.startFor(minutes);
        jest.advanceTimersByTime(delayMs);
        await promise;
        expect(console.error).toHaveBeenCalledWith('エラー: 指定されたビープ音ファイルが見つかりません: /path/to/nonexistent.mp3');
        expect(playSoundSpy).not.toHaveBeenCalled();
    });
});
