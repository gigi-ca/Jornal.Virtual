import 'dart:async';
import 'package:flutter/material.dart';

import '../../colors/app_colors.dart';
import '../login.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  int step = 0;

  @override
  void initState() {
    super.initState();

    Timer(const Duration(seconds: 1), () {
      setState(() => step = 1);
    });

    Timer(const Duration(seconds: 2), () {
      setState(() => step = 2);
    });

    Timer(const Duration(seconds: 3), () {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const LoginScreen()),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              AppColors.primary,
              AppColors.accent,
            ],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: Center(
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 500),
            child: _buildContent(),
          ),
        ),
      ),
    );
  }

  Widget _buildContent() {
    if (step == 0) {
      return const SizedBox();
    }

    if (step == 1) {
      return Image.asset(
        "assets/logotransp.svg",
        key: const ValueKey(1),
        width: 250,
      );
    }

    return Image.asset(
      "assets/images/logotrans.png",
      key: const ValueKey(2),
      width: 250,
    );
  }
}