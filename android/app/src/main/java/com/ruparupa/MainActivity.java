package com.mobileappruparupa;

import android.os.Bundle; 
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  @Override
  protected void onCreate(Bundle savedInstancedState) {
      SplashScreen.show(this, true);
      super.onCreate(savedInstancedState);
      
  }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Ruparupa";
  }
}
