import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';
import { getCachedProfile, saveCachedProfile } from './storage';

const execAsync = promisify(exec);

export interface InstagramProfile {
    username: string;
    fullName: string;
    followers: number;
    following: number;
    profilePicUrl: string;
    biography: string;
}

export async function getInstagramProfile(username: string): Promise<InstagramProfile | null> {
    try {
        // 1. Check Cache & End of Day Logic
        const cached = getCachedProfile(username);
        let forceUpdate = false;
        let isEndOfDaySync = false;

        // Get current time in Venezuela
        const now = new Date();
        const venezuelaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Caracas' }));
        const hours = venezuelaTime.getHours();
        const minutes = venezuelaTime.getMinutes();
        const todayStr = venezuelaTime.toISOString().split('T')[0];

        // Debug Log (Temporary, to verify it works)
        console.log(`[Time Check] VZLA: ${hours}:${minutes.toString().padStart(2, '0')} | Window Active: ${hours === 23 && minutes >= 50}`);

        // Check if we are in the "End of Day" window (23:50 - 23:59)
        if (hours === 23 && minutes >= 50) {
            // Check if we already synced today
            if (cached?.lastEndOfDaySync !== todayStr) {
                console.log(`[End of Day] Force updating for ${todayStr} (Time: ${hours}:${minutes})`);
                forceUpdate = true;
                isEndOfDaySync = true;
            }
        }

        if (!forceUpdate && cached && (Date.now() < cached.expiresAt)) {
            console.log(`Using cached data for ${username} (Expires at: ${new Date(cached.expiresAt).toLocaleTimeString()})`);
            return {
                username,
                fullName: username,
                followers: cached.followers,
                following: 0,
                profilePicUrl: '',
                biography: ''
            };
        }

        // 2. Run Python Script
        console.log(`Fetching fresh data for ${username} via Apify...`);
        const scriptPath = path.join(process.cwd(), 'scripts', 'get_followers.py');
        const { stdout, stderr } = await execAsync(`python3 "${scriptPath}" "${username}"`, { env: process.env });

        if (stderr) {
            console.error('Script stderr:', stderr);
        }

        const followers = parseInt(stdout.trim(), 10);

        if (isNaN(followers)) {
            throw new Error('Invalid output from Python script');
        }

        // 3. Update Cache
        saveCachedProfile(username, followers, isEndOfDaySync);

        return {
            username,
            fullName: username,
            followers,
            following: 0,
            profilePicUrl: '',
            biography: ''
        };

    } catch (error) {
        console.error('Error fetching Instagram profile:', error);

        // Fallback to cache if available even if expired
        const cached = getCachedProfile(username);
        if (cached) {
            return {
                username,
                fullName: username,
                followers: cached.followers,
                following: 0,
                profilePicUrl: '',
                biography: ''
            };
        }

        return null;
    }
}
