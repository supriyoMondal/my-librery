console.log(window.screen.availWidth)

FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)

FilePond.setOptions({
    stylePanelAspectRatio: 260 / 200,
    imageResizeTargetWidth: 200,
    imageResizeTargetHeight: 260,
})

FilePond.parse(document.body);