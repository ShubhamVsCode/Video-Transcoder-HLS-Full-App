# Video Transcoder with HLS support

You can upload a video in 1080p and it will transcode in different resolution with ffmpeg and support HLS(HTTP Live Streaming) for better video viewing experience

System Design:
![video-transcoder-hls png](https://github.com/ShubhamVsCode/Video-Transcoder-HLS-Full-App/assets/99742546/0291a847-2787-42cb-94b4-cd27149673b9)

Demo Video:
[Youtube](https://youtu.be/1CwbeK-pYx8)

```bash
ffmpeg -i input.mp4  -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}
```


