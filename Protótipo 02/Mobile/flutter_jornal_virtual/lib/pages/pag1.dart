import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

import 'inicial.dart';

class Pagina1 extends StatelessWidget {
  const Pagina1({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF3F0F0),

      body: SafeArea(
        child: Column(
          children: [
            // TOPO
            Stack(
              children: [
                Container(
                  width: double.infinity,
                  height: 260,
                  color: const Color(0xFFD91B65),
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
                      width: 50,
                      height: 50,

                      decoration: BoxDecoration(
                        color: const Color(0xFFD91B65),
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
                        "Robótica em\nfoco",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          fontFamily: 'CrimsonPro',
                        ),
                      ),

                      SizedBox(height: 12),

                      Text(
                        "❝O futuro\né agora❞",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 26,
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
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(140),
                    ),
                    child: SizedBox(
                      width: 220,
                      height: 140,
                      child: Image.asset(
                        "/imgs/robotica.jpeg",
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
                                TextSpan(
                                  text: 'A',
                                  style: TextStyle(
                                    fontFamily: 'CrimsonPro',
                                    fontSize: 42,
                                    color: Color(0xFF7A1836),
                                    fontWeight: FontWeight.bold,
                                    height: 1,
                                  ),
                                ),

                                TextSpan(
                                  text: '''
 ciência e a tecnologia tomam conta dos corredores do SESI.

Alunos se preparam para os desafios da Olimpíada Brasileira de Robótica com protótipos inovadores e muito trabalho em equipe.

A robótica vai muito além de montar peças.
Ela é a linguagem do futuro que nossos alunos já dominam no presente.
''',
                                  style: TextStyle(
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
Neste ano, o desafio exige que os robôs sejam capazes de superar obstáculos.

Cada linha de código representa um passo para compreender como transformar o mundo ao redor.

"O aprendizado aqui é prático. Eles erram, ajustam e comemoram cada conquista".
                            ''',
                            style: TextStyle(
                              fontFamily: 'CSVincero',
                              fontSize: 17,
                              height: 1.6,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    const Text(
                      '❝A ciência nos move!❞',
                      style: TextStyle(
                        color: Color(0xFFA11E54),
                        fontSize: 34,
                        fontFamily: 'CrimsonPro',
                      ),
                    ),

                    const SizedBox(height: 28),

                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFE7D3BC),
                        borderRadius: BorderRadius.circular(22),
                      ),
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 38,
                            backgroundImage: AssetImage("/imgs/professor.jpeg"),
                          ),

                          const SizedBox(width: 16),

                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  "Por: Professor Alysson Camargo",
                                  style: TextStyle(
                                    fontFamily: 'CrimsonPro',
                                    color: Color(0xFFA11E54),
                                    fontSize: 16,
                                  ),
                                ),

                                const SizedBox(height: 8),

                                const Text(
                                  "Professor de robótica formado na Universidade e instrutor de provas",
                                  style: TextStyle(
                                    fontFamily: 'CrimsonPro',
                                    fontSize: 14,
                                  ),
                                ),

                                const SizedBox(height: 14),

                                Row(
                                  children: [
                                    IconButton(
                                      onPressed: () {},
                                      icon: const FaIcon(
                                        FontAwesomeIcons.microsoft,
                                        color: Color(0xFFA11E54),
                                        size: 22,
                                      ),
                                    ),

                                    IconButton(
                                      onPressed: () {},
                                      icon: const FaIcon(
                                        FontAwesomeIcons.instagram,
                                        color: Color(0xFFA11E54),
                                        size: 22,
                                      ),
                                    ),

                                    IconButton(
                                      onPressed: () {},
                                      icon: const FaIcon(
                                        FontAwesomeIcons.github,
                                        color: Color(0xFFA11E54),
                                        size: 22,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),

      bottomNavigationBar: Container(
        height: 78,
        color: const Color(0xFFD91B65),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            Icon(Icons.home_outlined, color: Colors.black, size: 32),

            Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.menu, size: 40),
            ),

            Icon(Icons.person_outline, color: Colors.black, size: 32),

            Icon(Icons.settings, color: Colors.black, size: 32),
          ],
        ),
      ),
    );
  }
}
