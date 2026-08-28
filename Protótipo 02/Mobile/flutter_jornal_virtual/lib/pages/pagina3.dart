import 'package:flutter/material.dart';
import 'package:flutter_jornal_virtual/pages/perfil.dart';

import 'inicial.dart';

class Pagina3 extends StatelessWidget {
  const Pagina3({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF3F0F0),

      body: SafeArea(
        child: Column(
          children: [
            Stack(
              children: [
                Container(
                  width: double.infinity,
                  height: 260,
                  color: const Color(0xFFD92B68),
                ),

                Positioned(
                  top: 16,
                  left: 16,
                  child: GestureDetector(
                    onTap: () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(builder: (_) => const HomePage()),
                      );
                    },
                    child: Container(
                      width: 30,
                      height: 30,
                      decoration: BoxDecoration(
                        color: const Color(0xFFD92B68),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.30),
                            blurRadius: 12,
                            offset: const Offset(0, 5),
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.undo,
                        color: Colors.white,
                        size: 28,
                      ),
                    ),
                  ),
                ),

                Positioned(
                  left: 22,
                  top: 80,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        "Horta em\nSintonia",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          fontFamily: 'CrimsonPro',
                        ),
                      ),
                      SizedBox(height: 12),
                      Text(
                        "❝Colhendo o\nnosso amanhã❞",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          height: 1.1,
                          fontFamily: 'CrimsonPro',
                        ),
                      ),
                    ],
                  ),
                ),

                Positioned(
                  right: 0,
                  bottom: 0,
                  child: ClipRRect(
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(140),
                    ),
                    child: SizedBox(
                      width: 220,
                      height: 140,
                      child: Image.asset(
                        "/imgs/feiradeciencias.jpg",
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                ),
              ],
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 18,
                  vertical: 18,
                ),
                child: Column(
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: RichText(
                            text: TextSpan(
                              children: [
                                const TextSpan(
                                  text: 'O',
                                  style: TextStyle(
                                    fontFamily: 'CrimsonPro',
                                    fontSize: 42,
                                    color: Color(0xFFD92B68),
                                    fontWeight: FontWeight.bold,
                                    height: 1,
                                  ),
                                ),
                                TextSpan(
                                  text: '''
 projeto da horta escolar traz a sustentabilidade para o dia a dia dos alunos do SESI.

Com o cultivo de hortaliças e temperos orgânicos, a comunidade aprende na prática sobre a preservação ambiental.

Cuidar da terra vai muito além do plantio.
É entender o ciclo da vida e valorizar a alimentação saudável desde a raiz.
''',
                                  style: const TextStyle(
                                    fontFamily: 'CSVincero',
                                    fontSize: 17,
                                    height: 1.6,
                                    color: Colors.black,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),

                        const SizedBox(width: 20),

                        Expanded(
                          child: Text(
                            '''
Neste ciclo, os estudantes aplicam técnicas de compostagem e reaproveitamento de água.

Cada semente regada representa a conscientização e a mudança de hábitos para transformar o espaço urbano.

"Ver o entusiasmo deles ao colher o que plantaram é a maior recompensa do projeto".
''',
                            style: const TextStyle(
                              fontFamily: 'CSVincero',
                              fontSize: 17,
                              height: 1.6,
                              color: Colors.black,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    const Text(
                      '❝A natureza nos ensina!❞',
                      style: TextStyle(
                        color: Color(0xFFD92B68),
                        fontSize: 34,
                        fontFamily: 'CrimsonPro',
                      ),
                    ),

                    const SizedBox(height: 28),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),

      bottomNavigationBar: Container(
        height: 65,
        color: const Color(0xFFD92B68),
        child: Row(
          children: [
            Expanded(
              child: IconButton(
                icon: const Icon(Icons.home, color: Colors.white, size: 30),
                onPressed: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (_) => const HomePage()),
                  );
                },
              ),
            ),
            Expanded(
              child: Center(
                child: Container(
                  width: 50,
                  height: 50,
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                  child: const IconButton(
                    icon: Icon(Icons.menu, color: Colors.black, size: 30),
                    onPressed: null,
                  ),
                ),
              ),
            ),
            Expanded(
              child: IconButton(
                icon: const Icon(
                  Icons.account_circle,
                  color: Colors.white,
                  size: 32,
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const PerfilPage()),
                  );
                },
              ),
            ),
            Expanded(
              child: IconButton(
                icon: const Icon(Icons.settings, color: Colors.white, size: 30),
                onPressed: () {},
              ),
            ),
          ],
        ),
      ),
    );
  }
}