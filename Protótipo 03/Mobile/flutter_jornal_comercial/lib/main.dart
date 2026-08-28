import 'package:flutter/material.dart';

import 'core/theme/app_theme.dart';
import 'screens/auth/login_screen.dart';

void main() {
  runApp(const JornalApp());
}

class JornalApp extends StatelessWidget {
  const JornalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Jornal 360°',
      theme: AppTheme.light,
      home: const LoginScreen(),
    );
  }
}