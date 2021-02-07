import React, { useState, useRef, useEffect } from 'react';
import './Player.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faPauseCircle, faExpand, faVolumeUp, faVolumeMute, faVolumeDown } from '@fortawesome/free-solid-svg-icons';

function usePlayerState(videoPlayer) {
    const [playerState, setPlayerState] = useState({
        playing: false,
        percentage: 0,
        volume: 0.5,
        muted: false,
    });

    useEffect(() => {
        playerState.playing ? videoPlayer.current.play() : videoPlayer.current.pause();
    }, [playerState.playing]);

    function toggleVideoPlay() {
        setPlayerState({
            ...playerState,
            playing: !playerState.playing,
        })
    };

    function handleTimeUpdate() {
        const currentPercentage = (videoPlayer.current.currentTime / videoPlayer.current.duration) * 100;

        setPlayerState({
            ...playerState,
            percentage: currentPercentage,
        })
    };

    function handleChangeVideoPercentage(event) {
        const currentPercentageValue = event.target.value;
        videoPlayer.current.currentTime = videoPlayer.current.duration / 100 * currentPercentageValue;

        setPlayerState({
            ...playerState,
            percentage: currentPercentageValue
        })
    }

    function handleChangeSpeed(event) {
        videoPlayer.current.playbackRate = event.target.value;
    }

    function handleChangeVideoVolume(event) {
        videoPlayer.current.volume = event.target.value;

        setPlayerState({
            ...playerState,
            volume: videoPlayer.current.volume,
        })
    }

    function toggleVideoExpand() {
        videoPlayer.current.requestFullscreen();
    }

    function toggleVideoMute() {
        videoPlayer.current.muted = playerState.muted ? false : true;
        const setVolumeBar = playerState.muted ? videoPlayer.current.volume : 0;

        setPlayerState({
            ...playerState,
            muted: videoPlayer.current.muted,
            volume: setVolumeBar,
        })
    }

    return {
        playerState,
        toggleVideoPlay,
        handleTimeUpdate,
        handleChangeVideoPercentage,
        handleChangeSpeed,
        handleChangeVideoVolume,
        toggleVideoExpand,
        toggleVideoMute,
    }
}

const videoURL = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default function Player() {
    const buttonPlay = <FontAwesomeIcon size="2x" color="#000" icon={faPlayCircle} />;
    const buttonPause = <FontAwesomeIcon size="2x" color="#000" icon={faPauseCircle} />;
    const buttonVolumeUp = <FontAwesomeIcon size="2x" color="#000" icon={faVolumeUp} />;
    const buttonVolumeMute = <FontAwesomeIcon size="2x" color="#000" icon={faVolumeMute} />;
    const buttonVolumeDown = <FontAwesomeIcon size="2x" color="#000" icon={faVolumeDown} />;
    const videoPlayer = useRef(null);
    const {
        playerState,
        toggleVideoPlay,
        handleTimeUpdate,
        handleChangeVideoPercentage,
        handleChangeSpeed,
        handleChangeVideoVolume,
        toggleVideoExpand,
        toggleVideoMute,
    } = usePlayerState(videoPlayer);

    return (
        <div className="MainContainer">
            <div className="ContentVideo">
                <div className="ContainerVideo">
                    <video className="Video" onClick={toggleVideoPlay}
                        src={videoURL} ref={videoPlayer}
                        poster="https://www.jornaldafronteira.com.br/wp-content/uploads/2020/03/galaxia.jpg"
                        onTimeUpdate={handleTimeUpdate}
                    />
                </div>

                <div className="ContainerInputRange">
                    <input className="InputTimeVideo" type="range" min="0" max="100" step="0.01"
                        value={playerState.percentage} onChange={handleChangeVideoPercentage}
                    />
                </div>

                <div className="Controls">
                    <div className="ControlsLeft">
                        <button className="ButtonPlayPause" onClick={toggleVideoPlay}>
                            {playerState.playing ? buttonPause : buttonPlay}
                        </button>

                        <button className="ButtonVolume" onClick={toggleVideoMute}>
                            {playerState.muted ? buttonVolumeMute : (playerState.volume > 0.5 ? buttonVolumeUp : buttonVolumeDown)}
                        </button>

                        <input className="InputVolume" type="range" min="0" max="1" step="0.01"
                            value={playerState.volume} onChange={handleChangeVideoVolume}
                        />
                    </div>

                    <div className="ControlsRight">
                        <select className="SelectSpeed" onChange={handleChangeSpeed}>
                            {[1, 2, 3, 4].map(speed => (
                                <option key={`speedChange_${speed}`}>
                                    {speed}
                                </option>
                            ))}
                        </select>

                        <button className="ButtonExpand" onClick={toggleVideoExpand}>
                            <FontAwesomeIcon size="2x" color="#000" icon={faExpand} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};