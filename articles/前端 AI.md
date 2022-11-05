# 前端 AI

## 活体检测

[前端实现活体人脸检测](https://juejin.cn/post/7145732134630588447)

1、创建人脸模型

引入tensorflow训练好的人脸特征点检测模型，预测 486 个 3D 人脸特征点，推断出人脸的近似面部几何图形。

```js
async createDetector(){
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
        maxFaces:1, //检测到的最大面部数量
        refineLandmarks:true, //可以完善眼睛和嘴唇周围的地标坐标，并在虹膜周围输出其他地标
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh', //WASM二进制文件和模型文件所在的路径
    };
    this.detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
}
```

2、人脸识别

```js
async renderPrediction() {
    var video = this.$refs['video'];
    var canvas = this.$refs['canvas'];
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    const Faces = await this.detector.estimateFaces(video, {
        flipHorizontal:false, //镜像
    });
    if (Faces.length > 0) {
        this.log(`检测到人脸`);
    } else {
        this.log(`没有检测到人脸`);
    }
}
```