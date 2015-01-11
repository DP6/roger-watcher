// chrome.devtools.panels.create("Pudim Validator", "pudim32.png", "devtools/panel.html", function(panel) { });
chrome.devtools.panels.create("Roger Vortex", "../img/min-32.png", "../panel.html", function(panel) {
	var button = panel.createStatusBarButton("../img/ico-remove.png", "Limpar disparos", false);

	panel.onShown.addListener(function tmp(panelWindow){
		var _window = panelWindow;
		panel.onShown.removeListener(tmp);

		button.onClicked.addListener(function btnClear(){
			_window.PUDIM.clear();
		});
	})
});