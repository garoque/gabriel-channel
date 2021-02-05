import React, { useState, useRef, useEffect } from 'react';
import './Player.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faPauseCircle, faExpand } from '@fortawesome/free-solid-svg-icons';

function usePlayerState(videoPlayer) {
    const [playerState, setPlayerState] = useState({
        playing: false,
        percentage: 0,
        volume: 0.5,
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

    return {
        playerState,
        toggleVideoPlay,
        handleTimeUpdate,
        handleChangeVideoPercentage,
        handleChangeSpeed,
        handleChangeVideoVolume,
        toggleVideoExpand,
    }
}

const videoURL = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default function Player() {
    const buttonPlay = <FontAwesomeIcon size="2x" color="#000" icon={faPlayCircle} />;
    const buttonPause = <FontAwesomeIcon size="2x" color="#000" icon={faPauseCircle} />;
    const videoPlayer = useRef(null);
    const {
        playerState,
        toggleVideoPlay,
        handleTimeUpdate,
        handleChangeVideoPercentage,
        handleChangeSpeed,
        handleChangeVideoVolume,
        toggleVideoExpand,
    } = usePlayerState(videoPlayer);

    return (
        <div className="MainContainer">
            <div className="ContentVideo">
                <video width="640" height="480" onClick={toggleVideoPlay}
                    src={videoURL} ref={videoPlayer}
                    poster="https://www.jornaldafronteira.com.br/wp-content/uploads/2020/03/galaxia.jpg"
                    onTimeUpdate={handleTimeUpdate}
                />
                <div className="ContainerInputRange">
                    <input className="InputRange" type="range" min="0" max="100" step="0.01"
                        value={playerState.percentage} onChange={handleChangeVideoPercentage}
                    />
                </div>

                <div className="Controls">
                    <div className="ControlsLeft">
                        <button className="ButtonPlayPause" onClick={toggleVideoPlay}>
                            {playerState.playing ? buttonPause : buttonPlay}
                        </button>

                        <input className="InputRange" type="range" min="0" max="1" step="0.01"
                            value={playerState.volume} onChange={handleChangeVideoVolume}
                        />
                    </div>

                    <div className="ControlsRight">
                        <select className="SelectSpeed" onChange={handleChangeSpeed}>
                            {[1, 2, 3, 4, 5].map(speed => (
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