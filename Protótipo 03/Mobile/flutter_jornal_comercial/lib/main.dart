import 'package:flutter/material.dart';
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
      title: 'Jornal Virtual',
      theme: ThemeData(
        fontFamily: 'Arial',
        scaffoldBackgroundColor: const Color(0xFFF8F7FC),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6C3CEB),
        ),
      ),
      home: const LoginScreen(),
    );
  }
}