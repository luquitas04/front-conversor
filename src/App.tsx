import { useState, useEffect } from 'react';

const App: React.FC = () => {
    const [spotifyUrl, setSpotifyUrl] = useState<string>('');
    const [youtubePlaylistUrl, setYoutubePlaylistUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get('googleAccessToken');
        if (token) {
            setGoogleAccessToken(token);
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSpotifyUrl(e.target.value);
    };

    const handleGoogleLogin = () => {
        window.location.href = 'https://backend-conversor.onrender.com/auth/google';
    };

    const handleConvert = async () => {
        if (!googleAccessToken) {
            setError('Please authenticate with Google first.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('https://backend-conversor.onrender.com/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ spotifyPlaylistUrl: spotifyUrl, googleAccessToken }),
            });

            const data = await response.json();

            if (response.ok) {
                setYoutubePlaylistUrl(data.youtubePlaylistUrl);
            } else {
                setError('Failed to convert playlist. Please try again.');
            }
        } catch (err) {
            console.error('Error converting playlist:', err);
            setError('An error occurred while converting the playlist.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Convert Spotify Playlist to YouTube</h1>
            {!googleAccessToken && (
                <div>
                    <p>Please authenticate with Google to proceed:</p>
                    <button onClick={handleGoogleLogin} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                        Login with Google
                    </button>
                </div>
            )}
            {googleAccessToken && (
                <>
                    <div style={{ marginTop: '20px' }}>
                        <input
                            type="text"
                            placeholder="Enter Spotify Playlist URL"
                            value={spotifyUrl}
                            onChange={handleInputChange}
                            style={{ padding: '10px', width: '300px' }}
                        />
                        <button
                            onClick={handleConvert}
                            disabled={loading}
                            style={{
                                padding: '10px 20px',
                                marginLeft: '10px',
                                cursor: 'pointer',
                                backgroundColor: loading ? 'gray' : '#4285F4',
                                color: 'white',
                                border: 'none',
                            }}
                        >
                            {loading ? 'Converting...' : 'Convert'}
                        </button>
                    </div>
                    {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
                    {youtubePlaylistUrl && (
                        <p style={{ marginTop: '20px' }}>
                            Conversion successful! Your YouTube playlist is available{' '}
                            <a href={youtubePlaylistUrl} target="_blank" rel="noopener noreferrer">
                                here
                            </a>.
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

export default App;
