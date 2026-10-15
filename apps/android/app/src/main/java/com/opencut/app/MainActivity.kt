package com.opencut.app

import android.graphics.Color
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.ProgressBar
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private lateinit var progress: ProgressBar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val root = FrameLayout(this)
        webView = WebView(this)
        progress = ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal)
        progress.layoutParams = FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, 8
        )
        root.addView(webView, FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT
        ))
        root.addView(progress)
        setContentView(root)

        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.allowFileAccess = true
        settings.cacheMode = WebSettings.LOAD_DEFAULT
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        settings.userAgentString = settings.userAgentString + " OpenCutAndroid/1.0"

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                progress.progress = newProgress
                progress.visibility = if (newProgress < 100) android.view.View.VISIBLE else android.view.View.GONE
            }
        }
        webView.webViewClient = object : WebViewClient() {
            override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                if (request?.isForMainFrame == true) {
                    view?.loadData(
                        "<html><body style='background:#0b0e14;color:#fff;font-family:sans-serif;padding:24px'>" +
                        "<h2>Falha ao carregar</h2><p>${error?.description}</p>" +
                        "<button onclick='location.reload()'>Tentar novamente</button></body></html>",
                        "text/html", "UTF-8"
                    )
                }
            }
        }
        webView.loadUrl("https://new.opencut.app")
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }
}
EOF
echo done