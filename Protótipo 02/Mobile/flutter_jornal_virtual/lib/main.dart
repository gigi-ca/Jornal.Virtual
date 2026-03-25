import 'package:flutter/material.dart';
import 'ui/splash/screen.dart'; 

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Jornal Virtual',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFD52E5D), 
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
      home: Screen(), 
    );
  }
}