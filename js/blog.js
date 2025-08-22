// MOD Player and Parser functionality
import { ModPlayer } from 'https://atornblad.se/files/js-mod-player/player.js';

class ModPlayerController {
    constructor() {
        this.modPlayer = null;
        this.audioContext = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.currentTrack = null;
        this.currentTrackIndex = 0;
        
        // Expanded music library
        this.musicFiles = [
            'music/ELYSIUM.MOD',
            // 'music/lhs_brd2_chm2wordkg.mod',
            'music/space_debris.mod',
            // 'music/flashback.it',
            'music/enigma.mod',
            // 'music/AXELF.MOD',
            'music/hymn_to_aurora.mod'
        ];
        
        this.initializeElements();
        this.bindEvents();
    }
    
    initializeElements() {
        this.playButton = document.getElementById('playButton');
        this.pauseButton = document.getElementById('pauseButton');
        this.stopButton = document.getElementById('stopButton');
        this.toggleParser = document.getElementById('toggleParser');
        this.modStatus = document.getElementById('modStatus');
        this.currentTrackElement = document.getElementById('currentTrack');
        this.playerStateElement = document.getElementById('playerState');
        this.trackInfoElement = document.getElementById('trackInfo');
        this.modParser = document.getElementById('modParser');
        this.parserTitle = document.getElementById('parserTitle');
        this.parserResults = document.getElementById('parserResults');
        this.parserError = document.getElementById('parserError');
    }
    
    bindEvents() {
        this.playButton.addEventListener('click', () => this.handlePlay());
        this.pauseButton.addEventListener('click', () => this.handlePause());
        this.stopButton.addEventListener('click', () => this.handleStop());
        this.toggleParser.addEventListener('click', () => this.toggleParserSection());
        
        // Show play button initially
        this.playButton.style.display = 'inline-flex';
    }
    
    async initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
            this.modPlayer = new ModPlayer(this.audioContext);
        }
        
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }
    
    getRandomTrack() {
        const randomIndex = Math.floor(Math.random() * this.musicFiles.length);
        this.currentTrackIndex = randomIndex;
        return this.musicFiles[randomIndex];
    }
    
    getTrackName(filePath) {
        return filePath.split('/').pop().replace('.MOD', '');
    }
    
    async handlePlay() {
        try {
            await this.initAudioContext();
            
            if (this.isPaused && this.modPlayer) {
                // Resume from pause
                await this.modPlayer.play();
                this.isPaused = false;
                this.isPlaying = true;
            } else {
                // Load and play new random track
                const randomTrack = this.getRandomTrack();
                this.currentTrack = randomTrack;
                
                this.updateStatus('Loading...', '');
                
                try {
                    await this.modPlayer.load(randomTrack);
                    await this.modPlayer.play();
                    
                    this.isPlaying = true;
                    this.isPaused = false;
                    
                    const trackName = this.getTrackName(randomTrack);
                    this.updateStatus('Playing', trackName);
                    
                    // Parse the currently playing MOD file
                    await this.parseCurrentTrack(randomTrack);
                    
                } catch (loadError) {
                    console.warn(`Failed to load ${randomTrack}, trying next...`);
                    // Try next track in list if current fails
                    await this.tryNextTrack();
                }
            }
            
            this.updateButtonStates();
            
        } catch (error) {
            console.error('Error playing MOD:', error);
            this.updateStatus('Error', error.message);
        }
    }
    
    async tryNextTrack() {
        for (let attempts = 0; attempts < this.musicFiles.length; attempts++) {
            this.currentTrackIndex = (this.currentTrackIndex + 1) % this.musicFiles.length;
            const nextTrack = this.musicFiles[this.currentTrackIndex];
            
            try {
                await this.modPlayer.load(nextTrack);
                await this.modPlayer.play();
                
                this.currentTrack = nextTrack;
                this.isPlaying = true;
                this.isPaused = false;
                
                const trackName = this.getTrackName(nextTrack);
                this.updateStatus('Playing', trackName);
                
                // Parse the currently playing MOD file
                await this.parseCurrentTrack(nextTrack);
                return;
                
            } catch (error) {
                console.warn(`Failed to load ${nextTrack}, trying next...`);
                continue;
            }
        }
        
        // If all tracks fail
        this.updateStatus('Error', 'No playable tracks found');
    }
    
    handlePause() {
        if (this.modPlayer && this.isPlaying) {
            this.modPlayer.stop(); // Note: MOD player doesn't have true pause, so we stop
            this.isPlaying = false;
            this.isPaused = true;
            this.updateStatus('Paused', this.getTrackName(this.currentTrack));
            this.updateButtonStates();
        }
    }
    
    handleStop() {
        if (this.modPlayer) {
            this.modPlayer.stop();
            this.isPlaying = false;
            this.isPaused = false;
            this.currentTrack = null;
            this.updateStatus('Stopped', '');
            this.updateButtonStates();
        }
    }
    
    async parseCurrentTrack(trackPath) {
        try {
            // Fetch the MOD file that's currently playing
            const response = await fetch(trackPath);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${trackPath}: ${response.status}`);
            }
            
            const arrayBuffer = await response.arrayBuffer();
            const dataView = new DataView(arrayBuffer);
            const uint8Array = new Uint8Array(arrayBuffer);
            
            // Create a fake file object for the parser
            const fakeFile = {
                name: trackPath.split('/').pop(),
                size: arrayBuffer.byteLength,
                type: 'audio/mod',
                lastModified: Date.now()
            };
            
            this.parseModHeader(fakeFile, dataView, uint8Array);
            this.showParserSection(this.getTrackName(trackPath));
            
        } catch (error) {
            console.warn('Could not parse current track:', error);
            // Don't show parser if we can't fetch the file
        }
    }
    
    showParserSection(trackName) {
        this.parserTitle.textContent = `Analysis: ${trackName}`;
        this.modParser.style.display = 'block';
        this.parserResults.style.display = 'block';
        this.parserError.style.display = 'none';
        this.updateToggleButton();
    }
    
    
    toggleParserSection() {
        if (this.modParser.style.display === 'none' || !this.modParser.style.display) {
            this.modParser.style.display = 'block';
        } else {
            this.modParser.style.display = 'none';
        }
        this.updateToggleButton();
    }
    
    updateToggleButton() {
        if (this.modParser.style.display === 'none' || !this.modParser.style.display) {
            this.toggleParser.innerHTML = 'Show Analysis';
        } else {
            this.toggleParser.innerHTML = 'Hide Analysis';
        }
    }
    
    updateStatus(state, track) {
        this.modStatus.style.display = 'block';
        this.playerStateElement.textContent = state;
        this.currentTrackElement.textContent = track || '-';
        
        if (track) {
            this.trackInfoElement.textContent = `Track ${this.currentTrackIndex + 1} of ${this.musicFiles.length}`;
        } else {
            this.trackInfoElement.textContent = '';
        }
    }
    
    updateButtonStates() {
        if (this.isPlaying) {
            this.playButton.style.display = 'none';
            this.pauseButton.style.display = 'inline-flex';
            this.stopButton.style.display = 'inline-flex';
            this.toggleParser.style.display = 'inline-flex';
        } else if (this.isPaused) {
            this.playButton.style.display = 'inline-flex';
            this.pauseButton.style.display = 'none';
            this.stopButton.style.display = 'inline-flex';
            this.toggleParser.style.display = 'inline-flex';
            this.playButton.innerHTML = 'Resume';
        } else {
            this.playButton.style.display = 'inline-flex';
            this.pauseButton.style.display = 'none';
            this.stopButton.style.display = 'none';
            this.toggleParser.style.display = 'none';
            this.playButton.innerHTML = 'Play MOD';
        }
    }
    
    toggleParser() {
        if (this.modParser.style.display === 'none' || !this.modParser.style.display) {
            this.showParser();
        } else {
            this.hideParser();
        }
    }
    
    showParser() {
        this.modParser.style.display = 'block';
        this.parserToggle.innerHTML = 'Hide Parser';
    }
    
    hideParser() {
        this.modParser.style.display = 'none';
        this.parserToggle.innerHTML = 'MOD Parser';
        this.parserResults.style.display = 'none';
        this.parserError.style.display = 'none';
    }
    
    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            const arrayBuffer = await file.arrayBuffer();
            const dataView = new DataView(arrayBuffer);
            const uint8Array = new Uint8Array(arrayBuffer);
            
            this.parseModHeader(file, dataView, uint8Array);
            this.parserResults.style.display = 'block';
            this.parserError.style.display = 'none';
            
        } catch (error) {
            this.parserError.textContent = `Error parsing file: ${error.message}`;
            this.parserError.style.display = 'block';
            this.parserResults.style.display = 'none';
        }
    }
    
    parseModHeader(file, dataView, uint8Array) {
        // File information
        const fileInfo = document.getElementById('fileInfoParser');
        fileInfo.innerHTML = `
            <strong>Filename:</strong> ${file.name}<br>
            <strong>Size:</strong> ${file.size.toLocaleString()} bytes<br>
            <strong>Type:</strong> ${file.type || 'Unknown'}<br>
            <strong>Last Modified:</strong> ${file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'Unknown'}
        `;
        
        // Read song title (first 20 bytes)
        const songTitle = this.readString(uint8Array, 0, 20);
        
        // Read format identifier
        let formatId = '';
        let channels = 4;
        let isValidMod = false;
        
        // Check at offset 1080 (traditional position)
        if (uint8Array.length > 1083) {
            const id1080 = this.readString(uint8Array, 1080, 4);
            if (['M.K.', '4CHN', '6CHN', '8CHN', 'FLT4', 'FLT8'].includes(id1080)) {
                formatId = id1080;
                isValidMod = true;
                channels = this.getChannelCount(formatId);
            }
        }
        
        // If not found at 1080, try other positions
        if (!isValidMod && uint8Array.length > 1083) {
            for (let pos of [600, 950, 1084]) {
                if (uint8Array.length > pos + 3) {
                    const idAtPos = this.readString(uint8Array, pos, 4);
                    if (['M.K.', '4CHN', '6CHN', '8CHN', 'FLT4', 'FLT8'].includes(idAtPos)) {
                        formatId = idAtPos;
                        isValidMod = true;
                        channels = this.getChannelCount(formatId);
                        break;
                    }
                }
            }
        }
        
        // MOD properties
        let songLength = 0;
        let restartPos = 0;
        let numPatterns = 0;
        
        if (isValidMod && uint8Array.length > 1081) {
            songLength = uint8Array[950] || 0;
            restartPos = uint8Array[951] || 0;
            
            // Calculate number of patterns
            for (let i = 952; i < 952 + 128 && i < uint8Array.length; i++) {
                if (uint8Array[i] > numPatterns) {
                    numPatterns = uint8Array[i];
                }
            }
            numPatterns++;
        }
        
        const modInfo = document.getElementById('modInfoParser');
        modInfo.innerHTML = `
            <strong>Song Title:</strong> "${songTitle}"<br>
            <strong>Format:</strong> ${formatId || 'Unknown'}<br>
            <strong>Channels:</strong> ${channels}<br>
            <strong>Song Length:</strong> ${songLength} positions<br>
            <strong>Restart Position:</strong> ${restartPos}<br>
            <strong>Patterns:</strong> ${numPatterns}<br>
            <strong>Valid MOD:</strong> ${isValidMod ? 'Yes' : 'No'}
        `;
        
        // Generate hex dump
        this.generateHexDump(uint8Array, 128);
        
        // Parse samples
        if (isValidMod) {
            this.parseSamples(uint8Array);
        } else {
            document.getElementById('sampleInfoParser').innerHTML = 
                '<p style="color: #c0392b;">Cannot parse samples - invalid or unrecognized MOD format</p>';
        }
    }
    
    readString(uint8Array, offset, length) {
        let str = '';
        for (let i = 0; i < length && offset + i < uint8Array.length; i++) {
            const char = uint8Array[offset + i];
            if (char === 0) break;
            str += String.fromCharCode(char);
        }
        return str.replace(/[^\x20-\x7E]/g, '');
    }
    
    getChannelCount(formatId) {
        switch (formatId) {
            case 'M.K.':
            case '4CHN':
            case 'FLT4': return 4;
            case '6CHN': return 6;
            case '8CHN':
            case 'FLT8': return 8;
            default: return 4;
        }
    }
    
    generateHexDump(uint8Array, maxBytes) {
        let dump = '';
        const bytesToShow = Math.min(maxBytes, uint8Array.length);
        
        for (let i = 0; i < bytesToShow; i += 8) { // Reduced from 16 to 8 bytes per line
            dump += i.toString(16).padStart(4, '0').toUpperCase() + ': ';
            
            let hexLine = '';
            let asciiLine = '';
            for (let j = 0; j < 8; j++) { // Reduced from 16 to 8
                if (i + j < bytesToShow) {
                    const byte = uint8Array[i + j];
                    hexLine += byte.toString(16).padStart(2, '0').toUpperCase() + ' ';
                    asciiLine += (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.';
                } else {
                    hexLine += '   ';
                    asciiLine += ' ';
                }
            }
            
            dump += hexLine.padEnd(24, ' ') + ' |' + asciiLine + '|<br/>'; // Adjusted padding
        }

        document.getElementById('hexDumpParser').innerHTML = dump;
    }
    
    parseSamples(uint8Array) {
        let sampleHtml = '<table class="samples-table">';
        sampleHtml += '<tr><th>#</th><th>Name</th><th>Length</th><th>Finetune</th><th>Volume</th><th>Loop Start</th><th>Loop Length</th></tr>';
        
        for (let i = 0; i < 31; i++) {
            const offset = 20 + (i * 30); // Each sample entry is 30 bytes
            
            if (offset + 30 > uint8Array.length) break;
            
            const name = this.readString(uint8Array, offset, 22);
            const length = (uint8Array[offset + 22] << 8) | uint8Array[offset + 23];
            const finetune = uint8Array[offset + 24];
            const volume = uint8Array[offset + 25];
            const loopStart = (uint8Array[offset + 26] << 8) | uint8Array[offset + 27];
            const loopLength = (uint8Array[offset + 28] << 8) | uint8Array[offset + 29];
            
            // Only show samples that have a name or non-zero length
            if (name || length > 0) {
                sampleHtml += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>"${name}"</td>
                        <td>${length * 2} bytes</td>
                        <td>${finetune > 7 ? finetune - 16 : finetune}</td>
                        <td>${volume}/64</td>
                        <td>${loopStart * 2}</td>
                        <td>${loopLength * 2}</td>
                    </tr>
                `;
            }
        }
        
        sampleHtml += '</table>';
        document.getElementById('sampleInfoParser').innerHTML = sampleHtml;
    }
}

// Initialize the MOD player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ModPlayerController();
});

// Additional utility functions for the blog
class BlogUtilities {
    constructor() {
        this.initializeThemeToggling();
    }
    
    initializeThemeToggling() {
        // Enhanced theme toggling that works with the existing main.js
        const contrastButton = document.getElementById('contrast');
        const invmodeButton = document.getElementById('invmode');
        
        if (contrastButton) {
            contrastButton.addEventListener('click', () => {
                this.updateModPlayerTheme();
            });
        }
        
        if (invmodeButton) {
            invmodeButton.addEventListener('click', () => {
                this.updateModPlayerTheme();
            });
        }
        
        // Listen for theme changes
        const observer = new MutationObserver(() => {
            this.updateModPlayerTheme();
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
    
    updateModPlayerTheme() {
        // Force a small delay to ensure theme classes are applied
        setTimeout(() => {
            const modStatus = document.getElementById('modStatus');
            const modParser = document.getElementById('modParser');
            
            // Trigger a repaint to ensure styles are updated
            if (modStatus && modStatus.style.display !== 'none') {
                modStatus.style.display = 'none';
                modStatus.offsetHeight; // Trigger reflow
                modStatus.style.display = 'block';
            }
            
            if (modParser && modParser.style.display !== 'none') {
                modParser.style.display = 'none';
                modParser.offsetHeight; // Trigger reflow
                modParser.style.display = 'block';
            }
        }, 50);
    }
}

// Initialize blog utilities
document.addEventListener('DOMContentLoaded', () => {
    new BlogUtilities();
});