const fs = require('fs-extra');
const path = require('path');

const backup_and_restore_folder = path.join(__dirname, '../nejps-backup-folder'); // Updated path
const folders = [
    '/uploads',
].map(folder => path.join(__dirname, folder));

/**
 * Backup specified folders to the backup location.
 */
async function backupFolders() {
    try {
        await fs.ensureDir(backup_and_restore_folder); // Ensure backup directory exists

        for (let folder of folders) {
            if (!fs.existsSync(folder)) {
                console.warn(`Skipping: ${folder} does not exist.`);
                continue;
            }

            let folderName = path.basename(folder);
            let destination = path.join(backup_and_restore_folder, folderName);

            console.log(`Backing up ${folder} to ${destination}`);
            await fs.copy(folder, destination);
        }

        console.log('Backup completed successfully.');
    } catch (error) {
        console.error('Backup failed:', error);
    }
}

/**
 * Restore folders from the backup location.
 */
async function restoreFolders() {
    try {
        for (let folder of folders) {
            let folderName = path.basename(folder);
            let backupSource = path.join(backup_and_restore_folder, folderName);

            if (!fs.existsSync(backupSource)) {
                console.warn(`Skipping restore: Backup for ${folder} does not exist.`);
                continue;
            }

            console.log(`Restoring ${backupSource} to ${folder}`);
            await fs.copy(backupSource, folder);
        }

        console.log('Restore completed successfully.');
    } catch (error) {
        console.error('Restore failed:', error);
    }
}

// Uncomment to run backup or restore
//backupFolders();
//restoreFolders();


module.exports={backupFolders,restoreFolders}